export const WEB_COMPACT_VIEWPORT_HEIGHT = 600;

export function isWebCompactViewport(isWeb: boolean, height: number): boolean {
  return isWeb && height < WEB_COMPACT_VIEWPORT_HEIGHT;
}
