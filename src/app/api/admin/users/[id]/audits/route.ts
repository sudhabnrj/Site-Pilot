import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditReport } from "@/models/audit.model";
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function verifyAdmin(): Promise<boolean> {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.role === "admin") return true;
    }
    const refreshToken = await getRefreshTokenFromCookies();
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload?.role === "admin") return true;
    }
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role === "admin") return true;
  } catch {
    // ignore
  }
  return false;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const audits = await AuditReport.find({ userId: id })
      .sort({ createdAt: -1 })
      .select("_id domain url overallScore performanceScore seoScore securityScore accessibilityScore mobileScore issues recommendations status scanDuration createdAt screenshotUrl")
      .lean();

    return NextResponse.json({
      success: true,
      audits: audits.map((a: any) => ({
        ...a,
        _id: a._id.toString(),
        issueCount: Array.isArray(a.issues) ? a.issues.length : 0,
        criticalCount: Array.isArray(a.issues)
          ? a.issues.filter((i: any) => i.priority === "critical" || i.severity === "critical").length
          : 0,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch user audits." }, { status: 500 });
  }
}
