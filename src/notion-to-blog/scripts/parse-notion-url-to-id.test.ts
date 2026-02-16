import { parseNotionUrlToId } from './parse-notion-url-to-id';

describe('parseNotionUrlToId', () => {
  it('should parse proposal example: notion.so URL with Chinese title', () => {
    const url =
      'https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8';
    expect(parseNotionUrlToId(url)).toBe(
      '2c0d5e29-c68d-8181-b94e-ea22a921d6b8'
    );
  });

  it('should take last segment when title has multiple hyphens', () => {
    const url =
      'https://www.notion.so/workspace/文章標題-a-b-c-2c0d5e29c68d8181b94eea22a921d6b8';
    expect(parseNotionUrlToId(url)).toBe(
      '2c0d5e29-c68d-8181-b94e-ea22a921d6b8'
    );
  });

  it('should accept notion.so without www', () => {
    const url =
      'https://notion.so/workspace/PageTitle-2c0d5e29c68d8181b94eea22a921d6b8';
    expect(parseNotionUrlToId(url)).toBe(
      '2c0d5e29-c68d-8181-b94e-ea22a921d6b8'
    );
  });

  it('should accept URL with only one path segment (page title)', () => {
    const url =
      'https://www.notion.so/2c0d5e29c68d8181b94eea22a921d6b8';
    expect(parseNotionUrlToId(url)).toBe(
      '2c0d5e29-c68d-8181-b94e-ea22a921d6b8'
    );
  });

  it('should throw for invalid URL string', () => {
    expect(() => parseNotionUrlToId('not-a-url')).toThrow('Invalid Notion URL');
  });

  it('should throw for non-Notion host', () => {
    expect(() =>
      parseNotionUrlToId(
        'https://example.com/workspace/page-2c0d5e29c68d8181b94eea22a921d6b8'
      )
    ).toThrow('URL is not a Notion URL');
  });

  it('should throw when last segment is not 32 hex chars', () => {
    expect(() =>
      parseNotionUrlToId('https://www.notion.so/short-id-123')
    ).toThrow('Could not find a 32-character ID at the end of the Notion URL path');
  });

  it('should throw when last segment contains non-hex characters', () => {
    expect(() =>
      parseNotionUrlToId(
        'https://www.notion.so/page-2c0d5e29c68d8181b94eea22a921d6bz'
      )
    ).toThrow(
      'The last segment of the Notion URL is not a valid 32-character hex string'
    );
  });
});
