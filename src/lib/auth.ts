import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_ACCESS_SECRET || "sitepilot_nextauth_secret_key_2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        await connectToDatabase();
        const cleanEmail = user.email.toLowerCase();
        const providerName = (account?.provider || "google") as "google" | "github";
        const providerAccId = account?.providerAccountId || (user as any).id || "";
        const oauthImage = user.image || (profile as any)?.picture || (profile as any)?.avatar_url || "";

        let existingUser = await User.findOne({ email: cleanEmail });

        if (existingUser) {
          // Update existing user OAuth info if needed
          let updated = false;
          if (!existingUser.providerAccountId && providerAccId) {
            existingUser.providerAccountId = providerAccId;
            existingUser.providerId = providerAccId;
            updated = true;
          }
          if (existingUser.provider !== providerName && existingUser.provider === "local") {
            existingUser.provider = providerName;
            updated = true;
          }
          if (oauthImage && (existingUser.image !== oauthImage || !existingUser.profileImage)) {
            existingUser.image = oauthImage;
            existingUser.profileImage = oauthImage;
            existingUser.avatar = oauthImage;
            updated = true;
          }
          if (!existingUser.isEmailVerified) {
            existingUser.isEmailVerified = true;
            updated = true;
          }
          existingUser.lastLogin = new Date();
          await existingUser.save();

          user.id = (existingUser._id || existingUser.id).toString();
          user.image = existingUser.profileImage || existingUser.image || oauthImage;
          (user as any).role = existingUser.role || "user";
          (user as any).provider = existingUser.provider || providerName;
        } else {
          // Parse first and last name from OAuth name
          const fullName = user.name || cleanEmail.split("@")[0] || "User";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || "";

          const newUser = await User.create({
            email: cleanEmail,
            name: fullName,
            firstName,
            lastName,
            image: oauthImage,
            profileImage: oauthImage,
            avatar: oauthImage,
            provider: providerName,
            providerAccountId: providerAccId,
            providerId: providerAccId,
            role: "user",
            status: "active",
            isEmailVerified: true,
            emailVerified: new Date(),
            lastLogin: new Date(),
          });

          user.id = (newUser._id || newUser.id).toString();
          user.image = oauthImage;
          (user as any).role = newUser.role || "user";
          (user as any).provider = providerName;
          console.log(`✅ [NextAuth OAuth] Created new ${providerName} user: '${cleanEmail}' with image`);
        }

        return true;
      } catch (err: any) {
        console.error("❌ [NextAuth OAuth Error]:", err);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.userId = user.id;
        token.email = user.email;
        token.role = (user as any).role || "user";
        token.provider = account?.provider || (user as any).provider || "oauth";
        token.image = user.image || (user as any).profileImage || (profile as any)?.picture || (profile as any)?.avatar_url || token.image || "";

        // Issue application JWT cookies (accessToken & refreshToken) for seamless session sync
        try {
          const tokenPayload = {
            userId: user.id,
            email: user.email || "",
            role: ((user as any).role as "admin" | "user") || "user",
          };
          const accessToken = generateAccessToken(tokenPayload);
          const refreshToken = generateRefreshToken(tokenPayload);
          await setAuthCookies(accessToken, refreshToken);
        } catch (err) {
          console.error("⚠️ [NextAuth Cookie Sync Error]:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId || token.id;
        (session.user as any).role = token.role || "user";
        (session.user as any).provider = token.provider || "oauth";
        session.user.image = (token.image as string) || session.user.image || "";
        (session.user as any).profileImage = session.user.image;
        (session.user as any).avatar = session.user.image;
      }
      return session;
    },
  },
};
