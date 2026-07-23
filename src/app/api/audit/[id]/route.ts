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

// GET: Fetch a specific audit report by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const report = await AuditReport.findOne({ _id: id, userId }).exec();

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Audit report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch audit report." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an audit report
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const result = await AuditReport.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Audit report not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Audit report deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete audit report." },
      { status: 500 }
    );
  }
}

// POST: Re-run audit OR apply fix for a report
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const existingReport = await AuditReport.findOne({ _id: id, userId }).exec();

    if (!existingReport) {
      return NextResponse.json(
        { success: false, message: "Audit report not found." },
        { status: 404 }
      );
    }

    // Try to parse request body to see if it is a fix action
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is fine (e.g. standard rerun scan)
    }

    if (body.action === "fix") {
      const { recommendationId, issueKeyword } = body;

      // 1. Filter out the recommendation
      if (recommendationId) {
        existingReport.recommendations = existingReport.recommendations.filter(
          (r) => r.id !== recommendationId
        );
      }

      // 2. Filter out the matching issue
      if (issueKeyword) {
        const keyword = issueKeyword.toLowerCase();
        existingReport.issues = existingReport.issues.filter(
          (i) => !i.issue.toLowerCase().includes(keyword) && !keyword.includes(i.issue.toLowerCase())
        );
      }

      await existingReport.save();

      return NextResponse.json({
        success: true,
        message: "Issue removed from database successfully.",
        report: existingReport,
      });
    }

    // Re-run audit
    const newAuditData = await AuditEngine.analyze({
      url: existingReport.url,
      userId,
    });

    // Update existing document
    Object.assign(existingReport, newAuditData);
    await existingReport.save();

    return NextResponse.json({
      success: true,
      message: "Audit report refreshed successfully.",
      report: existingReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process request." },
      { status: 500 }
    );
  }
}
