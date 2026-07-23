import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditReport } from "@/models/audit.model";
import { AuditEngine } from "@/lib/audit-engine";
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUserIdFromSession(req: Request): Promise<string> {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.userId) return payload.userId;
    }

    const refreshToken = await getRefreshTokenFromCookies();
    if (refreshToken) {
      const refreshPayload = verifyRefreshToken(refreshToken);
      if (refreshPayload?.userId) return refreshPayload.userId;
    }

    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession?.user && (nextAuthSession.user as any).id) {
      return (nextAuthSession.user as any).id;
    }
  } catch (err) {
    console.warn("⚠️ [Audit API Session Error]:", err);
  }
  return "demo-user-default-id";
}

// POST: Run Website Audit & Save to MongoDB Atlas
export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession(req);
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid website URL to audit." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Run audit engine analysis
    const auditData = await AuditEngine.analyze({ url, userId });

    // Save report document into MongoDB
    const report = await AuditReport.create(auditData);

    console.log(`✅ [Audit Engine] Successfully audited '${auditData.domain}' (Overall Score: ${auditData.overallScore}) for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Website audit completed successfully.",
      report,
    });
  } catch (error: any) {
    console.error("❌ [Audit API Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to audit website URL." },
      { status: 500 }
    );
  }
}

// GET: Fetch User Audit History
export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const reports = await AuditReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error: any) {
    console.error("❌ [Audit GET API Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch audit history." },
      { status: 500 }
    );
  }
}
