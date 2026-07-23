import type { Metadata } from "next";
import { geistFont, interFont } from "@/lib/fonts";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StoreProvider } from "@/components/providers/store-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site Pilot — AI Website Audit Dashboard",
  description:
    "AI-powered website audit platform. Analyze performance, SEO, accessibility, and security with intelligent insights and actionable recommendations.",
  keywords: ["website audit", "SEO", "performance", "accessibility", "AI insights"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${geistFont.variable} ${interFont.variable}`}>
        <AuthProvider>
          <StoreProvider>
            <DashboardShell>{children}</DashboardShell>
            <Toaster position="top-right" richColors closeButton />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
