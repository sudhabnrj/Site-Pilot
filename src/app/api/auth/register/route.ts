import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/user-repository";
import { registerSchema } from "@/validators/auth.validator";
import { hashPassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { generateRandomToken } from "@/lib/auth/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = validation.data;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateRandomToken();

    const newUser = await UserRepository.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      status: "active",
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      provider: "local",
      lastLogin: new Date(),
    });

    const tokenPayload = {
      userId: (newUser._id || newUser.id).toString(),
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    newUser.refreshToken = refreshToken;
    if (newUser.save) await newUser.save();

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: newUser._id || newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          isEmailVerified: newUser.isEmailVerified,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
