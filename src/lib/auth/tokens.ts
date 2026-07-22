import crypto from "crypto";

export function generateRandomToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generatePasswordResetToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // Reset token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return { token, hashedToken, expiresAt };
}
