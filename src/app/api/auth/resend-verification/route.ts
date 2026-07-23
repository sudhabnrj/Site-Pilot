import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { resendVerificationSchema } from "@/validators/auth.validator";
import { generateRandomToken } from "@/lib/auth/tokens";
import { sendVerificationEmail, getAppBaseUrl } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = resendVerificationSchema.safeParse(body);

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

    if (user && !user.isEmailVerified) {
      const newToken = generateRandomToken();
      user.emailVerificationToken = newToken;
      await user.save();

      const baseUrl = getAppBaseUrl(req);
      await sendVerificationEmail({
        to: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email,
        token: newToken,
        baseUrl,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "If an unverified account exists for this email, a new verification link has been sent.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
