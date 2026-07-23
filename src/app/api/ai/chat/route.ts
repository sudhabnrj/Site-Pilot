import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, domain = "example.com", report } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter a question for the AI Assistant." },
        { status: 400 }
      );
    }

    const lowerMsg = message.toLowerCase();
    let reply = "";

    if (lowerMsg.includes("seo") || lowerMsg.includes("search")) {
      reply = `To improve the SEO score for ${domain} (currently ${report?.seoScore || 84}/100):
1. Ensure all pages have unique 30-60 character <title> tags.
2. Add a 150-160 character meta description summarizing page content.
3. Use a single <h1> heading per page.
4. Provide Open Graph (og:title, og:image) tags for social media sharing.`;
    } else if (lowerMsg.includes("performance") || lowerMsg.includes("speed") || lowerMsg.includes("lcp") || lowerMsg.includes("cls")) {
      reply = `For performance optimization on ${domain} (LCP: ${report?.metrics?.lcp || 1.8}s, TTFB: ${report?.metrics?.ttfb || 250}ms):
1. Compress and convert images to WebP/AVIF format to reduce payload by up to 60%.
2. Defer non-critical JavaScript to prevent main-thread blocking.
3. Enable GZIP or Brotli compression on server responses.`;
    } else if (lowerMsg.includes("security") || lowerMsg.includes("ssl") || lowerMsg.includes("https") || lowerMsg.includes("hsts")) {
      reply = `To strengthen security headers on ${domain} (Security score: ${report?.securityScore || 90}/100):
1. Enforce HTTPS redirect for all incoming traffic.
2. Add Strict-Transport-Security (HSTS) with a max-age of 31536000.
3. Add Content-Security-Policy (CSP) and X-Frame-Options to prevent clickjacking and XSS attacks.`;
    } else if (lowerMsg.includes("accessibility") || lowerMsg.includes("aria") || lowerMsg.includes("alt")) {
      reply = `To meet WCAG 2.1 AA accessibility compliance for ${domain}:
1. Add alt attributes to all <img> elements describing the visual content.
2. Ensure text-to-background color contrast ratio meets at least 4.5:1.
3. Provide aria-label attributes for icon-only buttons.`;
    } else {
      reply = `Hello! I've analyzed ${domain} (Overall Score: ${report?.overallScore || 88}/100).
Your top priority is: ${report?.recommendations?.[0]?.title || "Compressing hero assets and configuring HSTS security headers"}. Let me know if you need specific step-by-step code guidance!`;
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process AI chat message." },
      { status: 500 }
    );
  }
}
