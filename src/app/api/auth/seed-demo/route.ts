import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/user-repository";
import { hashPassword } from "@/lib/auth/password";

export async function POST() {
  try {
    const adminEmail = "sudhabnrj@gmail.com";
    let user = await UserRepository.findByEmail(adminEmail, true);

    const hashedPassword = await hashPassword("Sudhabnrj@123");

    if (user) {
      user.password = hashedPassword;
      user.role = "admin";
      user.status = "active";
      user.isEmailVerified = true;
      if (user.save) await user.save();
    } else {
      user = await UserRepository.create({
        firstName: "Sudha",
        lastName: "Banerjee",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "active",
        isEmailVerified: true,
        provider: "local",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin account initialized successfully",
      user: {
        id: user._id || user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to initialize admin account" },
      { status: 500 }
    );
  }
}
