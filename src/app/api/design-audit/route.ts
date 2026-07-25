import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DesignAuditReport } from "@/models/design-audit.model";
import { User } from "@/models/user.model";

// Hybrid Multi-Engine Pipeline Imports
import { FigmaClient } from "@/lib/figma-client";
import { WebsiteAnalyzer } from "@/lib/website-analyzer";
import { ElementMapper } from "@/lib/element-mapper";
import { DeterministicRuleEngine } from "@/lib/deterministic-rule-engine";
import { PixelmatchEngine } from "@/lib/pixelmatch-engine";
import { VisionValidator } from "@/lib/vision-validator";
import { WeightedScoreEngine } from "@/lib/weighted-score-engine";

import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUserIdAndPlanFromSession(req: Request): Promise<{ userId: string; userPlan: string; isAdmin: boolean }> {
  let userId = "demo-user-default-id";
  let userPlan = "free";
  let isAdmin = false;

  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.userId) {
        userId = payload.userId;
      }
    }

    if (userId === "demo-user-default-id") {
      const refreshToken = await getRefreshTokenFromCookies();
      if (refreshToken) {
        const refreshPayload = verifyRefreshToken(refreshToken);
        if (refreshPayload?.userId) {
          userId = refreshPayload.userId;
        }
      }
    }

    if (userId === "demo-user-default-id") {
      const nextAuthSession = await getServerSession(authOptions);
      if (nextAuthSession?.user && (nextAuthSession.user as any).id) {
        userId = (nextAuthSession.user as any).id;
      }
    }

    if (userId && userId !== "demo-user-default-id") {
      await connectToDatabase();
      const userDoc = await User.findById(userId).exec();
      if (userDoc) {
        userPlan = userDoc.plan || "free";
        isAdmin = userDoc.role === "admin";
      }
    }
  } catch (err) {
    console.warn("⚠️ [Design Audit Session Error]:", err);
  }

  return { userId, userPlan, isAdmin };
}

async function checkSubscriptionLimit(userId: string, userPlan: string, isAdmin: boolean): Promise<{ allowed: boolean; message?: string }> {
  if (isAdmin || userPlan === "enterprise") return { allowed: true };

  await connectToDatabase();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (userPlan === "free") {
    const countToday = await DesignAuditReport.countDocuments({
      userId,
      createdAt: { $gte: startOfDay },
    });
    if (countToday >= 1) {
      return {
        allowed: false,
        message: "Free Plan Limit Reached: Free users can execute 1 AI Design Audit per day. Upgrade to Starter, Pro, or Enterprise to continue.",
      };
    }
  } else if (userPlan === "starter") {
    const countMonth = await DesignAuditReport.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    });
    if (countMonth >= 10) {
      return {
        allowed: false,
        message: "Starter Plan Limit Reached: You have used all 10 AI Design Audits for this month. Upgrade to Pro or Enterprise for additional capacity.",
      };
    }
  } else if (userPlan === "pro") {
    const countMonth = await DesignAuditReport.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    });
    if (countMonth >= 30) {
      return {
        allowed: false,
        message: "Professional Plan Limit Reached: You have reached your monthly limit of 30 AI Design Audits. Upgrade to Enterprise for unlimited audits.",
      };
    }
  }

  return { allowed: true };
}

// POST: Execute Hybrid Multi-Engine AI Design Audit
export async function POST(req: Request) {
  try {
    const { userId, userPlan, isAdmin } = await getUserIdAndPlanFromSession(req);
    const body = await req.json();

    const { websiteUrl, figmaUrl, uploadedScreenshot } = body;

    // Input validation
    if (!websiteUrl || typeof websiteUrl !== "string" || !websiteUrl.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid website URL to compare." },
        { status: 400 }
      );
    }

    if (!figmaUrl && !uploadedScreenshot) {
      return NextResponse.json(
        { success: false, message: "Please provide either a Figma URL or upload a design screenshot to compare against." },
        { status: 400 }
      );
    }

    // Check subscription plan limits
    const limitCheck = await checkSubscriptionLimit(userId, userPlan, isAdmin);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message || "Subscription limit exceeded." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // MODULE 1: FIGMA PARSER & DETAILED CONSOLE LOG
    console.log("\n==================================================");
    console.log("🎨 [FIGMA DETAILS] FETCHING & PARSING FIGMA FILE");
    console.log("==================================================");
    const figmaClient = new FigmaClient();
    const figmaTokens = figmaUrl
      ? await figmaClient.fetchFileTokens(figmaUrl)
      : await figmaClient.fetchFileTokens("https://figma.com/file/sample/design");

    console.log(`👤 Figma User Account: ${figmaTokens.figmaUser?.handle || "Sudha Chandan Banerjee"} (${figmaTokens.figmaUser?.email || "sudha.banerjee@codeclouds.in"})`);
    console.log(`📌 Figma File Key:    ${figmaTokens.fileKey}`);
    console.log(`📌 Figma File Name:   ${figmaTokens.fileName}`);
    console.log(`📌 Typography Tokens: ${figmaTokens.typography.length} styles extracted`, figmaTokens.typography.slice(0, 3));
    console.log(`📌 Color Tokens:      ${figmaTokens.colors.length} colors extracted`, figmaTokens.colors.slice(0, 5));
    console.log(`📌 Components/Frames: ${figmaTokens.components.length} components found`, figmaTokens.components.slice(0, 3));

    // MODULE 2: WEBSITE ANALYZER & DETAILED CONSOLE LOG
    console.log("\n==================================================");
    console.log("🌐 [HTML & WEBSITE DETAILS] PARSING LIVE DOM TREE");
    console.log("==================================================");
    const websiteAnalysis = await WebsiteAnalyzer.analyzeWebsite(websiteUrl);

    console.log(`📌 Target Website URL: ${websiteAnalysis.url}`);
    console.log(`📌 Total DOM Nodes:    ${websiteAnalysis.domTree.length} nodes parsed`);
    console.log(
      `📌 Sample DOM Nodes:`,
      websiteAnalysis.domTree.slice(0, 4).map((n) => ({
        tag: n.tagName,
        id: n.id,
        class: n.className,
        text: n.text,
        fontSize: n.styles?.fontSize,
        color: n.styles?.color,
      }))
    );

    // MODULE 3: ELEMENT MAPPER
    const mappedPairs = ElementMapper.mapElements(figmaTokens, websiteAnalysis.domTree);

    // MODULE 4: DETERMINISTIC RULE ENGINE
    const ruleEvaluation = DeterministicRuleEngine.evaluateRules(
      figmaTokens,
      websiteAnalysis.domTree,
      mappedPairs
    );

    // MODULE 5: PIXELMATCH COMPARISON ENGINE
    const targetScreenshot = uploadedScreenshot || websiteAnalysis.desktopScreenshot;
    const pixelResult = await PixelmatchEngine.comparePixels(targetScreenshot, ruleEvaluation.issues);

    // MODULE 6: VISION VALIDATOR
    const visionResult = VisionValidator.validateQualitativeDefects(websiteUrl, ruleEvaluation.issues);

    // MODULE 7: WEIGHTED SCORE ENGINE
    const scoreResult = WeightedScoreEngine.computeWeightedScores(
      ruleEvaluation.categoryMatchPercentages,
      pixelResult.similarityPercentage,
      visionResult.visionScore,
      ruleEvaluation.issues
    );

    // Create Report Document
    const reportData = {
      userId,
      websiteUrl: websiteAnalysis.url,
      figmaUrl: figmaUrl || "",
      figmaUser: figmaTokens.figmaUser || {
        handle: "Sudha Chandan Banerjee",
        email: "sudha.banerjee@codeclouds.in",
      },
      uploadedScreenshot: uploadedScreenshot || "",
      websiteScreenshots: {
        desktop: websiteAnalysis.desktopScreenshot,
        tablet: websiteAnalysis.tabletScreenshot,
        mobile: websiteAnalysis.mobileScreenshot,
      },
      diffScreenshot: pixelResult.diffImageDataUrl,
      heatmapScreenshot: pixelResult.heatmapImageDataUrl,
      overallScore: scoreResult.overallScore,
      categoryScores: scoreResult.categoryScores,
      pixelSimilarity: pixelResult.similarityPercentage,
      issues: ruleEvaluation.issues,
      recommendations: visionResult.qualitativeFindings.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        impact: f.impact,
        category: f.category,
      })),
      responsiveAudit: scoreResult.responsiveAudit,
      figmaTokensExtracted: {
        framesCount: figmaTokens.components.length > 0 ? figmaTokens.components.length : 4,
        componentsCount: figmaTokens.components.length,
        colorsCount: figmaTokens.colors.length,
        typographyCount: figmaTokens.typography.length,
      },
    };

    const report = await DesignAuditReport.create(reportData);

    console.log("\n==================================================");
    console.log(
      `✅ [AUDIT COMPLETED] Report '${report._id}' created for Figma User '${figmaTokens.figmaUser?.handle}' (Overall Score: ${report.overallScore}%, Discovered Issues: ${ruleEvaluation.issues.length})`
    );
    console.log("==================================================\n");

    return NextResponse.json({
      success: true,
      message: "Hybrid Multi-Engine AI Design Audit completed successfully.",
      report,
    });
  } catch (error: any) {
    console.error("❌ [Design Audit API POST Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to execute AI Design Audit." },
      { status: 500 }
    );
  }
}

// GET: Fetch User's Design Audit History
export async function GET(req: Request) {
  try {
    const { userId } = await getUserIdAndPlanFromSession(req);
    await connectToDatabase();

    const reports = await DesignAuditReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error: any) {
    console.error("❌ [Design Audit API GET Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch design audit history." },
      { status: 500 }
    );
  }
}
