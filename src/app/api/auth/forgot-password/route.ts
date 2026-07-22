import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { forgotPasswordSchema } from "@/validators/auth.validator";
import { generatePasswordResetToken } from "@/lib/auth/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const { hashedToken, expiresAt } = generatePasswordResetToken();
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = expiresAt;
      await user.save();
    }

    // Security best practice: Always return 200 regardless of whether email exists
    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
