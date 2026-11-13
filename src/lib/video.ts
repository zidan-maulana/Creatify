/**
 * Sanitasi Pemutar Video Eksternal & Pencegahan XSS (ADR-005 & 04_SYSTEM_DESIGN.md 6.3)
 * Mendukung YouTube & Vimeo dengan output embed URL aman
 */

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const VIMEO_REGEX = /(?:vimeo\.com\/)(\d+)/;

export interface SanitizedVideoResult {
  platform: "youtube" | "vimeo";
  videoId: string;
  embedUrl: string;
}

/**
 * Memvalidasi dan mengekstrak ID video serta menghasilkan URL embed yang aman
 */
export function sanitizeVideoUrl(url?: string | null): SanitizedVideoResult | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // 1. Uji YouTube
  const ytMatch = trimmed.match(YOUTUBE_REGEX);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: "youtube",
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    };
  }

  // 2. Uji Vimeo
  const vimeoMatch = trimmed.match(VIMEO_REGEX);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      platform: "vimeo",
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  return null;
}

/**
 * Memeriksa apakah URL yang diberikan adalah link video resmi yang didukung
 */
export function isValidVideoUrl(url?: string | null): boolean {
  return sanitizeVideoUrl(url) !== null;
}
