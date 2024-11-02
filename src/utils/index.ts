export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Assuming knownColors is passed in as an argument

export function getColorName(
  hexCode: string,
  knownColors: Array<{ name: string; code: string }>
): string {
  const userColor = hexToRGB(hexCode.toLowerCase());

  let closestColor = null;
  let minDistance = Infinity;

  for (const color of knownColors) {
    const knownColor = hexToRGB(color.code.toLowerCase());
    const distance = calculateColorDistance(userColor, knownColor);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  }

  return closestColor || "Unknown";
}

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

function calculateColorDistance(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const deltaR = color1.r - color2.r;
  const deltaG = color1.g - color2.g;
  const deltaB = color1.b - color2.b;
  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
}
