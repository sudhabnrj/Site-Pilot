import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { AuditReport } from "@/models/audit.model";
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function verifyAdmin(): Promise<{ ok: boolean; userId?: string }> {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.role === "admin") return { ok: true, userId: payload.userId };
    }

    const refreshToken = await getRefreshTokenFromCookies();
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload?.role === "admin") return { ok: true, userId: payload.userId };
    }

    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role === "admin") {
      return { ok: true, userId: (session?.user as any)?.id };
    }
  } catch {
    // ignore
  }
  return { ok: false };
}

export async function GET(req: Request) {
  const { ok } = await verifyAdmin();
  if (!ok) {
    return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan") || "all";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Build filter query
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    if (plan !== "all") filter.plan = plan;
    if (status !== "all") filter.status = status;

    const skip = (page - 1) * limit;
    const totalCount = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -refreshToken -emailVerificationToken -passwordResetToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fetch audit counts per user
    const userIds = users.map((u: any) => u._id.toString());
    const auditCounts = await AuditReport.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const auditCountMap: Record<string, number> = {};
    auditCounts.forEach((a: any) => { auditCountMap[a._id] = a.count; });

    // Summary stats
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ status: "active" });
    const paidUsers = await User.countDocuments({ plan: { $in: ["starter", "pro", "enterprise"] } });
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({ createdAt: { $gte: thisMonthStart } });

    return NextResponse.json({
      success: true,
      stats: { totalUsers, activeUsers, paidUsers, newThisMonth },
      users: users.map((u: any) => ({
        ...u,
        _id: u._id.toString(),
        plan: u.plan || "free",
        status: u.status || "active",
        provider: u.provider || "local",
        profileImage: u.profileImage || u.image || u.avatar || u.picture || u.avatar_url || "",
        image: u.image || u.profileImage || u.avatar || u.picture || u.avatar_url || "",
        avatar: u.avatar || u.profileImage || u.image || u.picture || u.avatar_url || "",
        auditCount: auditCountMap[u._id.toString()] || 0,
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch users." }, { status: 500 });
  }
}
