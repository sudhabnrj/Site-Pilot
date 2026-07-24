import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { AuditReport } from "@/models/audit.model";
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function verifyAdmin(): Promise<{ ok: boolean; userId?: string; email?: string }> {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.role === "admin") return { ok: true, userId: payload.userId, email: payload.email };
    }
    const refreshToken = await getRefreshTokenFromCookies();
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload?.role === "admin") return { ok: true, userId: payload.userId, email: payload.email };
    }
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role === "admin") {
      return { ok: true, userId: (session?.user as any)?.id, email: (session?.user as any)?.email };
    }
  } catch {
    // ignore
  }
  return { ok: false };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ok } = await verifyAdmin();
  if (!ok) {
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ok, userId: adminUserId } = await verifyAdmin();
  if (!ok) {
    return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    if (adminUserId && id === adminUserId) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own logged-in admin account." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found or already deleted." }, { status: 404 });
    }

    // Permanently delete user document from MongoDB
    await User.findByIdAndDelete(id);

    // Delete all associated audit reports for this user permanently from DB
    await AuditReport.deleteMany({ userId: id });

    return NextResponse.json({
      success: true,
      message: "User and all associated audit data permanently deleted.",
      deletedUserId: id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}
