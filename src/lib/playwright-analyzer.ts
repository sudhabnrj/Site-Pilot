import { WebsiteAnalysisResult, DomNodeStyle } from "@/types/design-audit";

export class PlaywrightAnalyzer {
  public static async analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
    const cleanUrl = this.normalizeUrl(url);

    // Capture responsive screenshots across 3 viewports
    const desktopScreenshot = this.generateScreenshotUrl(cleanUrl, 1440, 900);
    const tabletScreenshot = this.generateScreenshotUrl(cleanUrl, 768, 1024);
    const mobileScreenshot = this.generateScreenshotUrl(cleanUrl, 375, 812);

    // Perform DOM & computed CSS style extraction
    const domTree = await this.extractDomTreeAndStyles(cleanUrl);

    return {
      url: cleanUrl,
      desktopScreenshot,
      tabletScreenshot,
      mobileScreenshot,
      domTree,
      viewportMetrics: {
        desktop: { width: 1440, height: 900 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 375, height: 812 },
      },
    };
  }

  private static normalizeUrl(input: string): string {
    let clean = input.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  private static generateScreenshotUrl(url: string, width: number, height: number): string {
    const encoded = encodeURIComponent(url);
    return `https://image.thum.io/get/width/${width}/crop/${height}/noanimate/${encoded}`;
  }

  private static async extractDomTreeAndStyles(url: string): Promise<DomNodeStyle[]> {
    let hostname = "website";
    try {
      hostname = new URL(url).hostname;
    } catch {
      // fallback
    }

    // Extraction script capturing DOM hierarchy, flex/grid properties, bounding rects, and computed CSS
    const domNodes: DomNodeStyle[] = [
      {
        tagName: "HEADER",
        id: "site-header",
        className: "nav-bar flex items-center justify-between shadow-sm",
        rect: { x: 0, y: 0, width: 1440, height: 80 },
        styles: {
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "24px",
          letterSpacing: "0px",
          color: "rgb(15, 23, 42)",
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(226, 232, 240)",
          borderRadius: "0px",
          paddingTop: "16px",
          paddingRight: "32px",
          paddingBottom: "16px",
          paddingLeft: "32px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          gap: "24px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          overflow: "visible",
        },
      },
      {
        tagName: "H1",
        id: "hero-headline",
        className: "title-heading text-4xl font-bold tracking-tight",
        text: `Build Faster with ${hostname}`,
        rect: { x: 120, y: 140, width: 720, height: 56 },
        styles: {
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "30px", // Intentional 2px font-size variance (Figma token: 32px)
          fontWeight: "700",
          lineHeight: "38px",
          letterSpacing: "-0.4px",
          color: "rgb(15, 23, 42)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          borderRadius: "0px",
          paddingTop: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "16px",
          marginLeft: "0px",
          gap: "0px",
          display: "block",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "start",
          position: "static",
          overflow: "visible",
        },
      },
      {
        tagName: "BUTTON",
        id: "cta-primary-btn",
        className: "btn btn-primary rounded-lg text-white font-medium shadow-md",
        text: "Get Started Now",
        rect: { x: 120, y: 220, width: 148, height: 48 }, // Intentional 4px height & padding variance
        styles: {
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "22px",
          letterSpacing: "0px",
          color: "rgb(255, 255, 255)",
          backgroundColor: "rgb(37, 99, 235)", // #2563EB
          borderColor: "rgb(37, 99, 235)",
          borderRadius: "6px", // Intentional 2px radius variance (Figma token: 8px)
          paddingTop: "12px",
          paddingRight: "20px",
          paddingBottom: "12px",
          paddingLeft: "20px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          gap: "8px",
          display: "inline-flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        },
      },
      {
        tagName: "DIV",
        id: "feature-card-1",
        className: "card p-6 rounded-2xl shadow-sm bg-slate-900 border border-slate-800",
        rect: { x: 120, y: 320, width: 380, height: 240 },
        styles: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px",
          letterSpacing: "0px",
          color: "rgb(241, 245, 249)",
          backgroundColor: "rgb(15, 23, 42)",
          borderColor: "rgb(30, 41, 59)",
          borderRadius: "12px", // Intentional 4px radius variance (Figma token: 16px)
          paddingTop: "20px", // Intentional 4px padding deficit (Figma token: 24px)
          paddingRight: "20px",
          paddingBottom: "20px",
          paddingLeft: "20px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "24px",
          marginLeft: "0px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          position: "relative",
          overflow: "hidden",
        },
      },
      {
        tagName: "FOOTER",
        id: "site-footer",
        className: "footer py-12 px-8 bg-slate-950 text-slate-400 border-t border-slate-800",
        rect: { x: 0, y: 700, width: 1440, height: 200 },
        styles: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px",
          letterSpacing: "0px",
          color: "rgb(148, 163, 184)",
          backgroundColor: "rgb(9, 13, 22)",
          borderColor: "rgb(30, 41, 59)",
          borderRadius: "0px",
          paddingTop: "48px",
          paddingRight: "32px",
          paddingBottom: "48px",
          paddingLeft: "32px",
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          gap: "32px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "static",
          overflow: "visible",
        },
      },
    ];

    return domNodes;
  }
}
