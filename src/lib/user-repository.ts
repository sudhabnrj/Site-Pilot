import { connectToDatabase } from "@/lib/mongodb";
import { User, IUser } from "@/models/user.model";
import { hashPassword } from "@/lib/auth/password";

async function ensureAdminExists() {
  try {
    const adminEmail = "sudhabnrj@gmail.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await hashPassword("Sudhabnrj@123");
      admin = await User.create({
        firstName: "Sudha",
        lastName: "Banerjee",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "active",
        isEmailVerified: true,
        provider: "local",
      });
      console.log("✅ [MongoDB Atlas] Default Admin sudhabnrj@gmail.com initialized in MongoDB Cloud");
    }
  } catch (err: any) {
    console.error("⚠️ [MongoDB Atlas Admin Init Error]:", err.message);
  }
}

export class UserRepository {
  static async findByEmail(email: string, includePassword = false) {
    await connectToDatabase();
    await ensureAdminExists();
    const cleanEmail = email.toLowerCase();
    let query = User.findOne({ email: cleanEmail });
    if (includePassword) {
      query = query.select("+password");
    }
    return await query.exec();
  }

  static async findById(id: string) {
    await connectToDatabase();
    return await User.findById(id).exec();
  }

  static async findByResetToken(token: string) {
    await connectToDatabase();
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).exec();
  }

  static async findByVerificationToken(token: string) {
    await connectToDatabase();
    return await User.findOne({ emailVerificationToken: token }).exec();
  }

  static async create(userData: Partial<IUser> & { password?: string }) {
    await connectToDatabase();
    const cleanEmail = userData.email!.toLowerCase();
    const user = await User.create({
      ...userData,
      email: cleanEmail,
    });
    console.log(`✅ [MongoDB Atlas] Saved user '${cleanEmail}' directly to Cloud Database`);
    return user;
  }

  static async update(id: string, updateData: Partial<any>) {
    await connectToDatabase();
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}
