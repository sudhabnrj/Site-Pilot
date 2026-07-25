import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DesignAuditReport } from "@/models/design-audit.model";
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
    console.warn("⚠️ [Design Audit ID API Session Error]:", err);
  }
  return "demo-user-default-id";
}

// GET: Fetch Single Design Audit Report by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const report = await DesignAuditReport.findOne({ _id: id, userId }).exec();

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Design audit report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("❌ [Design Audit GET ID Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch design audit report." },
      { status: 500 }
    );
  }
}

// DELETE: Remove Design Audit Report by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserIdFromSession(req);
    await connectToDatabase();

    const deletedReport = await DesignAuditReport.findOneAndDelete({ _id: id, userId }).exec();

    if (!deletedReport) {
      return NextResponse.json(
        { success: false, message: "Design audit report not found or un-authorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Design audit report deleted successfully.",
      id,
    });
  } catch (error: any) {
    console.error("❌ [Design Audit DELETE ID Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete design audit report." },
      { status: 500 }
    );
  }
}
