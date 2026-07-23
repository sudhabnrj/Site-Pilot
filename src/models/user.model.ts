import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  image?: string;
  avatar?: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  isEmailVerified: boolean;
  emailVerified?: boolean | Date | null;
  emailVerificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  refreshToken?: string | null;
  lastLogin?: Date | null;
  provider: "local" | "google" | "github";
  providerAccountId?: string;
  providerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default in queries
    },
    phone: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Schema.Types.Mixed,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerAccountId: {
      type: String,
      default: "",
    },
    providerId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js hot-reloading
export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
