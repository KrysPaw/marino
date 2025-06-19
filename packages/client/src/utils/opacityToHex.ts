export const opacityToHex = (opacity: number): string => {
  if (opacity < 0 || opacity > 1) {
    throw new RangeError("Opacity must be between 0 and 1");
  }
  const hex = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return hex.toUpperCase();
}