import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    if (!plan || !["free", "starter", "pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ success: false, message: "Invalid plan type." }, { status: 400 });
    }

    let userId: string | null = null;
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload?.userId) userId = payload.userId;
    }
    if (!userId) {
      const refreshToken = await getRefreshTokenFromCookies();
      if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);
        if (payload?.userId) userId = payload.userId;
      }
    }
    if (!userId) {
      const session = await getServerSession(authOptions);
      if ((session?.user as any)?.id) userId = (session?.user as any).id;
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized session." }, { status: 401 });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(userId, { plan }, { new: true });

    return NextResponse.json({
      success: true,
      message: `Plan updated to ${plan} successfully.`,
      plan: updatedUser?.plan || plan,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to update user plan" }, { status: 500 });
  }
}
