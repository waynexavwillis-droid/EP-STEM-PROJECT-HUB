
const BANNED_WORDS = [
  'porn', 'p0rn', 'xxx', 'sex', 'gambling', 'casino', 'betting', 'poker', 'slots', 
  'nude', 'viagra', 'escort', 'adult', 'dating', 'hookup'
];

const ALLOWED_DOMAINS = [
  'imagekit.io',
  'youtube.com',
  'youtu.be',
  'microbit.org',
  'makecode.microbit.org',
  'images.unsplash.com',
  'api.dicebear.com',
  'picsum.photos'
];

export const checkContentModeration = (text: string): boolean => {
  if (!text) return false;
  const normalizedText = text.toLowerCase().replace(/[^a-zA-Z0-9\s\.:\/]/g, '');
  
  // Check for banned words
  const hasBannedWord = BANNED_WORDS.some(word => normalizedText.includes(word));
  if (hasBannedWord) return true;

  // Check for unapproved links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  
  if (urls) {
    const hasUnapprovedDomain = urls.some(url => {
      try {
        const domain = new URL(url).hostname;
        return !ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
      } catch {
        return true; // Invalid URLs are flagged
      }
    });
    if (hasUnapprovedDomain) return true;
  }

  return false;
};
