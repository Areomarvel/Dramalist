/**
 * translateTitle.js
 * Formats a drama/movie title to show both original and English titles.
 * TMDB provides `name` (usually English or Romanized) and `original_name` (native script).
 * This util detects if original_name differs from name, and formats accordingly.
 */

// Detect if a string contains non-Latin characters (CJK, Thai, etc.)
function hasNonLatinChars(str) {
  if (!str) return false;
  return /[\u0E00-\u0E7F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u3400-\u4DBF\u20000-\u2A6DF]/.test(str);
}

/**
 * Returns a formatted title string.
 * If original_name has non-Latin chars and differs from name, returns:
 *   "original_name (name)"
 * Otherwise returns just the name (or original_name as fallback).
 */
export function formatTitle(name, originalName) {
  const displayName = name || originalName || 'Unknown Title';
  const original = originalName || name || '';

  if (original && hasNonLatinChars(original) && original !== displayName) {
    return `${original} (${displayName})`;
  }
  return displayName;
}

/**
 * Returns just the primary display name (English/Romanized).
 */
export function getPrimaryTitle(name, originalName) {
  return name || originalName || 'Unknown Title';
}
