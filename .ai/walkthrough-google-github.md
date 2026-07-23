# Google & GitHub OAuth Authentication Walkthrough

We have implemented Google and GitHub OAuth authentication for Site Pilot using NextAuth.js (Auth.js), MongoDB Atlas, Mongoose, and JWT sessions.

## Key Changes Implemented

### 1. NextAuth Configuration & Route Handler
- **[auth.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/lib/auth.ts)** & **[lib/auth.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/lib/auth.ts)**: Configured NextAuth with `GoogleProvider` and `GitHubProvider`, JWT strategy, and custom callbacks (`signIn`, `jwt`, `session`).
- **[route.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/app/api/auth/%5B...nextauth%5D/route.ts)**: Configured NextAuth API route handler supporting `GET` and `POST` requests for `/api/auth/[...nextauth]`.

### 2. User Model & MongoDB Integration
- **[user.model.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/models/user.model.ts)** & **[User.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/models/User.ts)**: Enhanced Mongoose User schema to support OAuth user fields (`name`, `image`, `avatar`, `providerAccountId`, `providerId`, `isEmailVerified`).
- **MongoDB Atlas User Management**: When an OAuth login succeeds:
  - If user exists: logs them in and updates provider details & avatar without creating duplicates.
  - If user is new: creates a new document with default `role: "user"`, `status: "active"`, and `isEmailVerified: true`.

### 3. Reusable UI & Custom Hooks
- **[SocialAuth.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/components/auth/SocialAuth.tsx)**: Reusable social login component containing "Continue with Google" and "Continue with GitHub" buttons, preserving existing design aesthetics and supporting loading spinners/disabled states.
- **[useSocialLogin.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/hooks/useSocialLogin.ts)**: Custom hook for triggering OAuth sign-in, tracking provider loading state, and displaying user-friendly `sonner` toast notifications for network errors or cancelled sign-ins.
- **[auth-card.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/components/auth/auth-card.tsx)** & **[sign-up-card.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/components/auth/sign-up-card.tsx)**: Integrated `SocialAuth` component.
- **[login/page.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/app/login/page.tsx)** & **[signup/page.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/app/signup/page.tsx)**: Connected `useSocialLogin` hook and query parameter error listeners.

### 4. Session, Protection & Middleware
- **[middleware.ts](file:///d:/anigravity/Site%20Pilot/site-pilot/src/middleware.ts)**: Updated to check NextAuth tokens (`next-auth.session-token`, `__Secure-next-auth.session-token`, `authjs.session-token`) in addition to custom `accessToken`/`refreshToken` cookies.
- **[session-provider.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/components/providers/session-provider.tsx)** & **[layout.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/app/layout.tsx)**: Wrapped root layout with `AuthProvider` (`SessionProvider`).
- **[dashboard/page.tsx](file:///d:/anigravity/Site%20Pilot/site-pilot/src/app/dashboard/page.tsx)**: Added `/dashboard` route pointing to DashboardPage.

### 5. Environment Variables
- **[.env.local](file:///d:/anigravity/Site%20Pilot/site-pilot/.env.local)**: Configured `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`.

---

## Verification & Type Safety

- Executed `npx tsc --noEmit` check: **0 type errors found**.
- Verified build and file structure alignment.
