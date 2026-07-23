import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const emailFrom = process.env.EMAIL_FROM || "Site Pilot <noreply@sitepilot.com>";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export interface SendEmailOptions {
  to: string;
  name?: string;
  token: string;
  baseUrl?: string;
}

/**
 * Utility helper to determine the exact base URL dynamically from request or environment
 */
export function getAppBaseUrl(req?: Request): string {
  if (req) {
    const origin = req.headers.get("origin");
    if (origin) return origin;

    const referer = req.headers.get("referer");
    if (referer) {
      try {
        return new URL(referer).origin;
      } catch (e) {}
    }

    const host = req.headers.get("host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      return `${protocol}://${host}`;
    }
  }

  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Send account activation / verification email
 */
export async function sendVerificationEmail({ to, name, token, baseUrl }: SendEmailOptions) {
  const appUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  const displayName = name || "Valued User";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800;">Site Pilot</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">AI-Powered Website Audit Platform</p>
      </div>

      <div style="padding: 24px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 24px;">
        <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Activate Your Account</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Hello ${displayName},
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for signing up for Site Pilot! Please click the button below to verify your email address and activate your account.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Activate Account
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verificationLink}" style="color: #2563eb; word-break: break-all;">${verificationLink}</a>
        </p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #94a3b8;">
        <p>If you didn't create an account with Site Pilot, you can safely ignore this email.</p>
        <p>© 2026 Site Pilot Platforms Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  console.log(`[Email Service] Sending verification email to ${to}...`);
  console.log(`[Email Link]: ${verificationLink}`);

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject: "Activate your Site Pilot account",
      html: htmlContent,
    });
    console.log(`[Email Service] Verification email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email Service Error] Failed to send verification email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({ to, name, token, baseUrl }: SendEmailOptions) {
  const appUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  const displayName = name || "Valued User";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800;">Site Pilot</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">AI-Powered Website Audit Platform</p>
      </div>

      <div style="padding: 24px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 24px;">
        <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Reset Your Password</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Hello ${displayName},
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password for your Site Pilot account. Click the button below to choose a new password.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Reset Password
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Or copy and paste this link into your browser:<br/>
          <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
        </p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #94a3b8;">
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>© 2026 Site Pilot Platforms Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  console.log(`[Email Service] Sending password reset email to ${to}...`);
  console.log(`[Email Link]: ${resetLink}`);

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject: "Reset your Site Pilot password",
      html: htmlContent,
    });
    console.log(`[Email Service] Password reset email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email Service Error] Failed to send password reset email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}
