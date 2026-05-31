// Parse a video URL into { platform, videoId } and derive a thumbnail.
// YouTube exposes public thumbnails; TikTok/Instagram do not, so callers
// should fall back to a manual thumbnailUrl for those platforms.

export function detectPlatform(url = '') {
  const u = url.toLowerCase()
  if (/youtube\.com|youtu\.be/.test(u)) return 'youtube'
  if (/tiktok\.com/.test(u)) return 'tiktok'
  if (/instagram\.com/.test(u)) return 'instagram'
  if (!url.trim()) return 'other'
  return 'other'
}

export function youtubeId(url = '') {
  // Handles watch?v=, youtu.be/, /embed/, /shorts/
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

// Returns a thumbnail URL or null. `manual` is the user-supplied fallback.
export function thumbnailFor({ videoUrl = '', platform, thumbnailUrl = '' } = {}) {
  const plat = platform || detectPlatform(videoUrl)
  if (plat === 'youtube') {
    const id = youtubeId(videoUrl)
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  }
  // TikTok / Instagram / other: rely on the manual fallback image if provided.
  return thumbnailUrl.trim() || null
}

export const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  other: 'Link',
}
