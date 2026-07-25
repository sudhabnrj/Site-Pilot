export interface LabColor {
  l: number; // Lightness: 0 to 100
  a: number; // Green-Red axis: -128 to +127
  b: number; // Blue-Yellow axis: -128 to +127
}

export interface ColorComparisonResult {
  expectedHex: string;
  actualHex: string;
  deltaE: number;
  isPass: boolean;
  message: string;
}

export class ColorDeltaE {
  /**
   * Converts HEX or RGB color string to RGB object { r, g, b } (0-255)
   */
  public static hexToRgb(colorStr: string): { r: number; g: number; b: number } | null {
    if (!colorStr) return null;
    let clean = colorStr.trim().toLowerCase();

    // Check RGB / RGBA format e.g. "rgb(37, 99, 235)"
    if (clean.startsWith("rgb")) {
      const match = clean.match(/\d+/g);
      if (match && match.length >= 3) {
        return {
          r: parseInt(match[0], 10),
          g: parseInt(match[1], 10),
          b: parseInt(match[2], 10),
        };
      }
    }

    // Check HEX format
    if (clean.startsWith("#")) {
      clean = clean.slice(1);
    }

    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }

    if (clean.length !== 6) return null;

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

    return { r, g, b };
  }

  /**
   * Converts RGB (0-255) to CIE LAB Color Space
   */
  public static rgbToLab(r: number, g: number, b: number): LabColor {
    // 1. RGB to Linear sRGB
    let rLinear = r / 255;
    let gLinear = g / 255;
    let bLinear = b / 255;

    rLinear = rLinear > 0.04045 ? Math.pow((rLinear + 0.055) / 1.055, 2.4) : rLinear / 12.92;
    gLinear = gLinear > 0.04045 ? Math.pow((gLinear + 0.055) / 1.055, 2.4) : gLinear / 12.92;
    bLinear = bLinear > 0.04045 ? Math.pow((bLinear + 0.055) / 1.055, 2.4) : bLinear / 12.92;

    // 2. Linear sRGB to XYZ (D65 Illuminant)
    let x = (rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805) * 100;
    let y = (rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722) * 100;
    let z = (rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505) * 100;

    // Reference White D65
    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;

    let xRel = x / refX;
    let yRel = y / refY;
    let zRel = z / refZ;

    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

    const fx = f(xRel);
    const fy = f(yRel);
    const fz = f(zRel);

    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const labB = 200 * (fy - fz);

    return { l, a, b: labB };
  }

  /**
   * Calculates CIE76 Delta E between two LAB colors
   */
  public static calculateDeltaE(color1: string, color2: string): ColorComparisonResult {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) {
      return {
        expectedHex: color1 || "Unknown",
        actualHex: color2 || "Unknown",
        deltaE: 0,
        isPass: true,
        message: "Invalid color format for Delta E calculation.",
      };
    }

    const lab1 = this.rgbToLab(rgb1.r, rgb1.g, rgb1.b);
    const lab2 = this.rgbToLab(rgb2.r, rgb2.g, rgb2.b);

    const dL = lab1.l - lab2.l;
    const dA = lab1.a - lab2.a;
    const dB = lab1.b - lab2.b;

    const deltaE = Math.sqrt(dL * dL + dA * dA + dB * dB);
    const roundedDeltaE = Number(deltaE.toFixed(2));
    const isPass = roundedDeltaE <= 2.0;

    return {
      expectedHex: color1.toUpperCase(),
      actualHex: color2.toUpperCase(),
      deltaE: roundedDeltaE,
      isPass,
      message: isPass
        ? `Pass: Delta E is ${roundedDeltaE} (<= 2.0 perception threshold).`
        : `Fail: Delta E is ${roundedDeltaE} (> 2.0 visual perception threshold).`,
    };
  }
}
