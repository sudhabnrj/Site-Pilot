import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { clearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { verifyRefreshToken } from "@/lib/auth/jwt";

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenFromCookies();

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload) {
        await connectToDatabase();
        await User.findByIdAndUpdate(payload.userId, { refreshToken: null });
      }
    }

    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    await clearAuthCookies();
    return NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );
  }
}
