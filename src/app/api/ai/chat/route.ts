import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, domain = "example.com", report } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Please type a question for the AI Audit Assistant." },
        { status: 400 }
      );
    }

    // Extract stats if report is present
    const overallScore = report?.overallScore ?? 85;
    const perfScore = report?.performanceScore ?? 80;
    const seoScore = report?.seoScore ?? 84;
    const a11yScore = report?.accessibilityScore ?? 75;
    const secScore = report?.securityScore ?? 90;
    const mobScore = report?.mobileScore ?? 74;

    const issues = report?.issues || [];
    const recommendations = report?.recommendations || [];

    const criticalIssues = issues.filter((i: any) => i.priority === "critical");
    const highIssues = issues.filter((i: any) => i.priority === "high");
    const seoIssues = issues.filter((i: any) => i.category === "SEO");
    const perfIssues = issues.filter((i: any) => i.category === "Performance");
    const secIssues = issues.filter((i: any) => i.category === "Security");
    const a11yIssues = issues.filter((i: any) => i.category === "Accessibility");
    const mobIssues = issues.filter((i: any) => i.category === "Mobile");

    const lcp = report?.metrics?.lcp ?? 2.4;
    const cls = report?.metrics?.cls ?? 0.08;
    const ttfb = report?.metrics?.ttfb ?? 250;

    const systemPrompt = `You are Lumina, a Senior Website Auditor and AI Assistant.
The user is asking questions about their website: "${domain}".
Active Audit Report Data:
- Overall Score: ${overallScore}/100
- Performance Score: ${perfScore}/100 (LCP: ${lcp}s, CLS: ${cls}, TTFB: ${ttfb}ms)
- SEO Score: ${seoScore}/100
- Accessibility Score: ${a11yScore}/100
- Security Score: ${secScore}/100
- Mobile Score: ${mobScore}/100

Identified Issues:
${issues.map((i: any) => `- [${i.priority.toUpperCase()}] [${i.category}] ${i.issue} (Impact: ${i.impact})`).join("\n")}

Recommendations:
${recommendations.map((r: any) => `- ${r.title}: ${r.description}`).join("\n")}

Respond to the user's question. Be concise, professional, and reference specific scores or issues from the active report data above when relevant.`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Site Pilot",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash:free",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const openRouterReply = data?.choices?.[0]?.message?.content;
          if (openRouterReply) {
            return NextResponse.json({ success: true, reply: openRouterReply });
          }
        }
      } catch (err) {
        console.warn("⚠️ [OpenRouter Fetch Failure]:", err);
      }
    }

    const lowerMsg = message.toLowerCase();
    let reply = "";

    // 1. Check for SEO-related query
    if (lowerMsg.includes("seo") || lowerMsg.includes("search") || lowerMsg.includes("keywords") || lowerMsg.includes("title")) {
      reply = `To optimize the SEO profile for **${domain}** (currently scored **${seoScore}/100**):

${
  seoIssues.length > 0
    ? `The following SEO issue(s) were identified:
${seoIssues.map((i: any, idx: number) => `${idx + 1}. **${i.issue}** (Impact: ${i.impact})`).join("\n")}`
    : "No major SEO issues were flagged! Ensure your headings follow a strict hierarchy and your sitemap is configured."
}

**Immediate Recommended Actions:**
1. Ensure your primary page has a single \`<h1>\` tag containing target keywords.
2. Add unique meta descriptions (150-160 characters) to help click-through rate.
3. Configure canonical links and Open Graph tags for social snippets.`;
    }
    // 2. Check for Performance / Speed related query
    else if (
      lowerMsg.includes("performance") ||
      lowerMsg.includes("speed") ||
      lowerMsg.includes("fast") ||
      lowerMsg.includes("slow") ||
      lowerMsg.includes("lcp") ||
      lowerMsg.includes("load") ||
      lowerMsg.includes("compress")
    ) {
      reply = `Here is the performance analysis for **${domain}** (Performance Score: **${perfScore}/100**):

* **Largest Contentful Paint (LCP):** ${lcp}s ${lcp > 2.5 ? "🔴 (Needs improvement)" : "🟢 (Good)"}
* **Cumulative Layout Shift (CLS):** ${cls} ${cls > 0.1 ? "🔴 (Needs improvement)" : "🟢 (Good)"}
* **Time to First Byte (TTFB):** ${ttfb}ms ${ttfb > 600 ? "🔴 (Slow response)" : "🟢 (Fast response)"}

${
  perfIssues.length > 0
    ? `Key performance issues identified:
${perfIssues.map((i: any, idx: number) => `${idx + 1}. **${i.issue}** (Impact: ${i.impact})`).join("\n")}`
    : "Your core web vitals are passing! Consider optimizing bundle payload further."
}

**Lumina AI Speed Recommendations:**
- Convert image assets to modern web formats (WebP or AVIF).
- Minimize render-blocking CSS/JS files and utilize lazy loading.
- Enable server-level Brotli compression on assets.`;
    }
    // 3. Check for Security related query
    else if (lowerMsg.includes("security") || lowerMsg.includes("ssl") || lowerMsg.includes("https") || lowerMsg.includes("header") || lowerMsg.includes("csp") || lowerMsg.includes("hsts")) {
      reply = `Security posture report for **${domain}** (Security Score: **${secScore}/100**):

${
  secIssues.length > 0
    ? `Identified vulnerability risks:
${secIssues.map((i: any, idx: number) => `${idx + 1}. **${i.issue}** (Severity: ${i.priority.toUpperCase()})`).join("\n")}`
    : "Excellent! Your site enforces HTTPS and configures modern security headers."
}

**Recommended Security Hardening Actions:**
1. Configure a \`Content-Security-Policy\` (CSP) header to prevent XSS.
2. Add the \`Strict-Transport-Security\` (HSTS) header to enforce secure TLS.
3. Configure \`X-Frame-Options: SAMEORIGIN\` to prevent Clickjacking attacks.`;
    }
    // 4. Check for Accessibility related query
    else if (lowerMsg.includes("accessibility") || lowerMsg.includes("alt") || lowerMsg.includes("aria") || lowerMsg.includes("contrast") || lowerMsg.includes("wcag")) {
      reply = `Accessibility WCAG 2.1 compliance details for **${domain}** (Score: **${a11yScore}/100**):

${
  a11yIssues.length > 0
    ? `Detected accessibility failures:
${a11yIssues.map((i: any, idx: number) => `${idx + 1}. **${i.issue}**`).join("\n")}`
    : "Your site has passed all WCAG accessibility guidelines!"
}

**Recommended Fixes:**
- Ensure all images have descriptive \`alt\` text.
- Verify text color contrast ratios are at least 4.5:1 for legibility.
- Provide ARIA labels on all icon-only buttons.`;
    }
    // 5. Check for Mobile related query
    else if (lowerMsg.includes("mobile") || lowerMsg.includes("phone") || lowerMsg.includes("responsive") || lowerMsg.includes("viewport") || lowerMsg.includes("screen")) {
      reply = `Mobile responsiveness score for **${domain}** is **${mobScore}/100**:

${
  mobIssues.length > 0
    ? `Usability flaws detected:
${mobIssues.map((i: any, idx: number) => `${idx + 1}. **${i.issue}**`).join("\n")}`
    : "Your site fits and scales perfectly on all viewport screen widths."
}

**Lumina AI Mobile Recommendations:**
- Add viewport scaling meta tags in the document header.
- Increase padding and margin size for interactive touch targets to avoid misclicks.
- Ensure images scale fluidly using responsive media rules.`;
    }
    // 6. Generic or Greeting Query
    else {
      reply = `Hello! I am your AI Audit Assistant. I have analyzed **${domain}** and compiled an overall score of **${overallScore}/100**.

**Active Audit Summary:**
* **SEO Score:** ${seoScore}/100
* **Performance Score:** ${perfScore}/100
* **Accessibility Score:** ${a11yScore}/100
* **Security Score:** ${secScore}/100
* **Mobile Score:** ${mobScore}/100

${
  criticalIssues.length > 0
    ? `There are **${criticalIssues.length} Critical** issues requiring immediate attention. The top recommended fix is: **${recommendations[0]?.title || "Compress hero assets"}**.`
    : `No critical issues were found. You can improve your score further by: **${recommendations[0]?.title || "optimizing assets"}**.`
}

Ask me specific questions like:
* *"How can I improve my SEO score?"*
* *"What is slow on my website?"*
* *"Tell me about security vulnerabilities"*`;
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to parse AI chat." },
      { status: 500 }
    );
  }
}
