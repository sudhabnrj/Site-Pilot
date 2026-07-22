import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import { User, IUser } from "@/models/user.model";

// File-backed persistent database path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "users-db.json");

// In-Memory map synced with disk file
const localUsersMap = new Map<string, any>();

// Helper to initialize and load data from disk file
function initFileDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      const rawData = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const usersArray = JSON.parse(rawData);
      localUsersMap.clear();
      for (const u of usersArray) {
        if (u && u.email) {
          // Re-attach save method for file persistence
          attachSaveMethod(u);
          localUsersMap.set(u.email.toLowerCase(), u);
        }
      }
    }
  } catch (err) {
    console.error("Local file database init error:", err);
  }
}

function saveFileDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const usersArray = Array.from(localUsersMap.values()).map((u) => {
      const copy = { ...u };
      delete copy.save;
      return copy;
    });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(usersArray, null, 2), "utf-8");
  } catch (err) {
    console.error("Local file database save error:", err);
  }
}

function attachSaveMethod(userObj: any) {
  userObj.save = async function () {
    this.updatedAt = new Date().toISOString();
    localUsersMap.set(this.email.toLowerCase(), this);
    saveFileDatabase();
    return this;
  };
}

// Run initial load from disk on module import
initFileDatabase();

export class UserRepository {
  static async findByEmail(email: string, includePassword = false) {
    const cleanEmail = email.toLowerCase();
    try {
      await connectToDatabase();
      let query = User.findOne({ email: cleanEmail });
      if (includePassword) {
        query = query.select("+password");
      }
      const user = await query.exec();
      if (user) return user;
    } catch {
      // Fallback to persistent file DB
    }

    const memUser = localUsersMap.get(cleanEmail);
    if (!memUser) return null;
    return memUser;
  }

  static async findById(id: string) {
    try {
      await connectToDatabase();
      const user = await User.findById(id).exec();
      if (user) return user;
    } catch {
      // Fallback to persistent file DB
    }

    for (const memUser of Array.from(localUsersMap.values())) {
      if (memUser._id === id || memUser.id === id) {
        return memUser;
      }
    }
    return null;
  }

  static async findByResetToken(token: string) {
    try {
      await connectToDatabase();
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      }).exec();
      if (user) return user;
    } catch {
      // Fallback
    }

    for (const memUser of Array.from(localUsersMap.values())) {
      if (
        memUser.passwordResetToken === token &&
        memUser.passwordResetExpires &&
        new Date(memUser.passwordResetExpires) > new Date()
      ) {
        return memUser;
      }
    }
    return null;
  }

  static async findByVerificationToken(token: string) {
    try {
      await connectToDatabase();
      const user = await User.findOne({ emailVerificationToken: token }).exec();
      if (user) return user;
    } catch {
      // Fallback
    }

    for (const memUser of Array.from(localUsersMap.values())) {
      if (memUser.emailVerificationToken === token) {
        return memUser;
      }
    }
    return null;
  }

  static async create(userData: Partial<IUser> & { password?: string }) {
    const cleanEmail = userData.email!.toLowerCase();
    try {
      await connectToDatabase();
      const user = await User.create({
        ...userData,
        email: cleanEmail,
      });
      return user;
    } catch {
      // Fallback to persistent file DB
    }

    const id = "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const newUser: any = {
      _id: id,
      id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: cleanEmail,
      password: userData.password,
      phone: userData.phone || "",
      profileImage: userData.profileImage || "",
      role: userData.role || "user",
      status: userData.status || "active",
      isEmailVerified: userData.isEmailVerified ?? false,
      emailVerificationToken: userData.emailVerificationToken || null,
      passwordResetToken: userData.passwordResetToken || null,
      passwordResetExpires: userData.passwordResetExpires || null,
      refreshToken: userData.refreshToken || null,
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toISOString() : now,
      provider: userData.provider || "local",
      createdAt: now,
      updatedAt: now,
    };

    attachSaveMethod(newUser);
    localUsersMap.set(cleanEmail, newUser);
    saveFileDatabase();

    return newUser;
  }

  static async update(id: string, updateData: Partial<any>) {
    try {
      await connectToDatabase();
      const user = await User.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (user) return user;
    } catch {
      // Fallback
    }

    const memUser = await this.findById(id);
    if (memUser) {
      Object.assign(memUser, updateData);
      memUser.updatedAt = new Date().toISOString();
      attachSaveMethod(memUser);
      localUsersMap.set(memUser.email.toLowerCase(), memUser);
      saveFileDatabase();
      return memUser;
    }
    return null;
  }
}
