import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/user-repository";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/cookies";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth/jwt";

export async function GET(req: Request) {
  try {
    let accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    }

    let payload = accessToken ? verifyAccessToken(accessToken) : null;

    if (!payload) {
      const refreshToken = await getRefreshTokenFromCookies();
      if (refreshToken) {
        const refreshPayload = verifyRefreshToken(refreshToken);
        if (refreshPayload) {
          const user = await UserRepository.findById(refreshPayload.userId);

          if (user && user.status === "active") {
            const tokenPayload = {
              userId: (user._id || user.id).toString(),
              email: user.email,
              role: user.role,
            };
            const newAccess = generateAccessToken(tokenPayload);
            const newRefresh = generateRefreshToken(tokenPayload);

            user.refreshToken = newRefresh;
            if (user.save) await user.save();

            await setAuthCookies(newAccess, newRefresh);

            return NextResponse.json({
              success: true,
              user: {
                id: user._id || user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                isEmailVerified: user.isEmailVerified,
                profileImage: user.profileImage || user.image || user.avatar || "",
                image: user.profileImage || user.image || user.avatar || "",
                avatar: user.profileImage || user.image || user.avatar || "",
                provider: user.provider || "local",
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
              },
            });
          }
        }
      }

      await clearAuthCookies();
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 200 }
      );
    }

    const user = await UserRepository.findById(payload.userId);

    if (!user || user.status !== "active") {
      await clearAuthCookies();
      return NextResponse.json(
        { success: false, authenticated: false, message: "User account inactive or not found", user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id || user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage || user.image || user.avatar || "",
        image: user.profileImage || user.image || user.avatar || "",
        avatar: user.profileImage || user.image || user.avatar || "",
        provider: user.provider || "local",
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false, message: error.message || "Failed to fetch user session", user: null },
      { status: 200 }
    );
  }
}
