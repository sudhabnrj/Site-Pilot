import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/user-repository";
import { loginSchema } from "@/validators/auth.validator";
import { comparePassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials format",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await UserRepository.findByEmail(email, true);

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          emailUnverified: true,
          message: "Please verify your email address before logging in. Check your inbox for the activation link.",
        },
        { status: 403 }
      );
    }

    const tokenPayload = {
      userId: (user._id || user.id).toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    if (user.save) await user.save();

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id || user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
