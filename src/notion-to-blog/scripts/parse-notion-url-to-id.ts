/**
 * Parses a Notion page URL and returns the page ID in UUID v4 format.
 *
 * Notion URLs look like: https://www.notion.so/{workspace}/{page-title}
 * The page-title often ends with the raw page ID (32 hex chars), e.g.:
 * "文章標題-2c0d5e29c68d8181b94eea22a921d6b8"
 *
 * @param url - Full Notion page URL
 * @returns Page ID in UUID v4 format (e.g. 2c0d5e29-c68d-8181-b94e-ea22a921d6b8)
 * @throws Error when URL is invalid or page ID cannot be extracted
 */
export function parseNotionUrlToId(url: string): string {
  let pathname: string;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid Notion URL');
  }
  if (!parsed.hostname.includes('notion')) {
    throw new Error('URL is not a Notion URL');
  }
  pathname = parsed.pathname;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    throw new Error('Notion URL has no path segments');
  }

  // Page title is the last path segment (e.g. "文章標題-2c0d5e29c68d8181b94eea22a921d6b8")
  const pageTitle = segments[segments.length - 1];
  const titleParts = pageTitle.split('-');
  const lastPart = titleParts[titleParts.length - 1];

  if (!lastPart || lastPart.length !== 32) {
    throw new Error(
      'Could not find a 32-character ID at the end of the Notion URL path'
    );
  }

  const hexRegex = /^[0-9a-fA-F]{32}$/;
  if (!hexRegex.test(lastPart)) {
    throw new Error(
      'The last segment of the Notion URL is not a valid 32-character hex string'
    );
  }

  // Format as UUID v4: 8-4-4-4-12
  return [
    lastPart.slice(0, 8),
    lastPart.slice(8, 12),
    lastPart.slice(12, 16),
    lastPart.slice(16, 20),
    lastPart.slice(20, 32),
  ].join('-');
}
