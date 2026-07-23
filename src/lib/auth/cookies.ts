import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

// 15 minutes in seconds
const ACCESS_TOKEN_MAX_AGE = 15 * 60;
// 30 days in seconds
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  const cookiesToClear = [
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "authjs.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  for (const name of cookiesToClear) {
    cookieStore.set(name, "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
