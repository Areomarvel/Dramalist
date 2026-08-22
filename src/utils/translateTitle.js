/**
 * translateTitle.js
 * Utility to format, translate, and filter drama/movie titles to ensure only English titles appear.
 */

// Dictionary mapping common native Asian titles (Korean/Chinese/Japanese/Thai) to English translations
const KNOWN_TRANSLATIONS = {
  '사랑의 불시착': 'Crash Landing on You',
  '도깨비': 'Goblin',
  '태양의 후예': 'Descendants of the Sun',
  '오징어 게임': 'Squid Game',
  '이상한 변호사 우영우': 'Extraordinary Attorney Woo',
  '이태원 클라쓰': 'Itaewon Class',
  '사이코지만 괜찮아': 'It\'s Okay to Not Be Okay',
  '눈물의 여왕': 'Queen of Tears',
  '선재 업고 튀어': 'Lovely Runner',
  '더 글로리': 'The Glory',
  '빈센조': 'Vincenzo',
  '킹더랜드': 'King the Land',
  '무빙': 'Moving',
  '호텔 델루나': 'Hotel Del Luna',
  '미스터 션샤인': 'Mr. Sunshine',
  '비밀의 숲': 'Stranger',
  '시그널': 'Signal',
  '응답하라 1988': 'Reply 1988',
  '슬기로운 의사생활': 'Hospital Playlist',
  '펜트하우스': 'The Penthouse',
  '부부의 세계': 'The World of the Married',
  '갯마을 차차차': 'Hometown Cha-Cha-Cha',
  '사내맞선': 'Business Proposal',
  '우리는 오늘부터': 'Woori the Virgin',
  '繁花': 'Blossoms Shanghai',
  '狂飙': 'The Knockout',
  '三体': 'Three-Body',
  '苍兰诀': 'Love Between Fairy and Devil',
  '星汉灿烂': 'Love Like the Galaxy',
  '长相思': 'Lost You Forever',
  '庆余年': 'Joy of Life',
  '陈情令': 'The Untamed',
  '山河令': 'Word of Honor',
  '梦华录': 'A Dream of Splendor',
  '与凤行': 'The Legend of Shen Li',
  'FIRST LOVE 初恋': 'First Love',
  '今際の国のアリス': 'Alice in Borderland',
  '今夜、世界からこの恋が消えても': 'Even If This Love Disappears from the World Tonight',
  '極悪女王': 'The Queen of Villains',
  '今際の国のアリス シーズン2': 'Alice in Borderland Season 2',
};

// Check if string contains any non-Latin scripts (CJK, Thai, Cyrillic, Arabic, etc.)
function containsNonLatin(str) {
  if (!str) return false;
  return /[\u0E00-\u0E7F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u3400-\u4DBF\u0400-\u04FF\u0600-\u06FF]/.test(str);
}

// Check if string contains Latin alphabet or numeric characters
function containsLatin(str) {
  if (!str) return false;
  return /[a-zA-Z0-9]/.test(str);
}

// Clean string by removing non-Latin parentheticals and native script
function cleanTitle(str) {
  if (!str) return '';
  const trimmed = str.trim();
  if (KNOWN_TRANSLATIONS[trimmed]) return KNOWN_TRANSLATIONS[trimmed];

  // Remove parenthetical native script e.g. "Drama Title (오징어 게임)" -> "Drama Title"
  let cleaned = str.replace(/\s*\([\u0E00-\u0E7F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u3400-\u4DBF\u0400-\u04FF\u0600-\u06FF\s,.-]+\)/g, '');

  // Remove individual native script characters
  cleaned = cleaned.replace(/[\u0E00-\u0E7F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u3400-\u4DBF\u0400-\u04FF\u0600-\u06FF]/g, '').trim();

  return cleaned;
}

/**
 * Returns clean English title with proper fallbacks so items never vanish.
 */
export function formatTitle(name, originalName) {
  if (!name && !originalName) return 'Untitled';

  if (name && KNOWN_TRANSLATIONS[name.trim()]) return KNOWN_TRANSLATIONS[name.trim()];
  if (originalName && KNOWN_TRANSLATIONS[originalName.trim()]) return KNOWN_TRANSLATIONS[originalName.trim()];

  const cleanedName = cleanTitle(name);
  if (cleanedName && containsLatin(cleanedName)) return cleanedName;

  const cleanedOriginal = cleanTitle(originalName);
  if (cleanedOriginal && containsLatin(cleanedOriginal)) return cleanedOriginal;

  if (name && containsLatin(name)) return cleanTitle(name);
  if (originalName && containsLatin(originalName)) return cleanTitle(originalName);

  // Return original name or title string as reliable fallback
  return (name || originalName || 'Untitled').trim();
}

/**
 * Returns just the primary display name (English/Romanized), or fallback if invalid.
 */
export function getPrimaryTitle(name, originalName) {
  return formatTitle(name, originalName);
}

/**
 * Helper function to determine if a drama/movie object has a valid title.
 * Always returns true as long as item has name or title.
 */
export function hasEnglishTitle(item) {
  if (!item) return false;
  const name = item.name || item.title || item.original_name || item.original_title || '';
  return name.trim().length > 0;
}

