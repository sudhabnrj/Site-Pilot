import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
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

    const user = await User.findById(id)
      .select("-password -refreshToken -emailVerificationToken -passwordResetToken")
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const auditCount = await AuditReport.countDocuments({ userId: id });
    const latestAudit = await AuditReport.findOne({ userId: id })
      .sort({ createdAt: -1 })
      .select("domain overallScore createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      user: {
        ...(user as any),
        _id: (user as any)._id.toString(),
        plan: (user as any).plan || "free",
        status: (user as any).status || "active",
        provider: (user as any).provider || "local",
        profileImage: (user as any).profileImage || (user as any).image || (user as any).avatar || (user as any).picture || (user as any).avatar_url || "",
        image: (user as any).image || (user as any).profileImage || (user as any).avatar || (user as any).picture || (user as any).avatar_url || "",
        avatar: (user as any).avatar || (user as any).profileImage || (user as any).image || (user as any).picture || (user as any).avatar_url || "",
        auditCount,
        latestAudit,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch user." }, { status: 500 });
  }
}
