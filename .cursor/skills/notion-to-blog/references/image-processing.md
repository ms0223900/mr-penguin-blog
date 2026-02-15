# Image Processing Reference

This document details how the skill handles image downloading and processing from Notion content.

## Overview

The `ImageProcessor` class handles the complete image workflow:
1. **Extraction**: Finds image URLs in Notion content
2. **Download**: Downloads images to local storage
3. **Processing**: Renames files with hash for uniqueness
4. **Validation**: Verifies downloaded files are valid images
5. **Update**: Replaces URLs in content with local paths

## Image URL Detection

### Supported Formats

The processor recognizes images in multiple formats:

#### Notion Image Tags
```html
<image source="https://prod-files-secure.s3.us-west-2.amazonaws.com/.../image.png" />
```

#### Markdown Images
```markdown
![Alt text](https://example.com/image.jpg)
```

### Extraction Logic

Images are extracted using regex patterns:
- `<image source="([^"]+)">` - Notion image tags
- `!\[.*?\]\(([^)]+)\)` - Markdown image syntax

## File Naming Strategy

### Hash Generation
- Uses MD5 hash of the original URL
- Takes first 8 characters for brevity
- Ensures uniqueness across different source URLs

### Filename Format
```
{original-filename}-{hash}.{extension}
```

**Examples**:
- `vacation-photo-abc12345.jpg`
- `diagram-1-def67890.png`
- `screenshot-xyz98765.webp`

### Extension Detection
- Extracted from URL path
- Supported: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
- Fallback: `png` if extension unclear

## Download Process

### HTTP Handling
- Supports both HTTP and HTTPS
- Follows redirects (301, 302)
- 30-second timeout per download
- Automatic retry for redirects

### Error Handling
- Network failures
- Invalid URLs
- Timeout errors
- HTTP error status codes

### Validation
- File size verification (> 0 bytes)
- Image header validation (JPEG, PNG, GIF, WebP)
- Content integrity checks

## Content Update

### Path Replacement
Original URLs are replaced with local paths:
```
From: https://example.com/image.jpg
To: /assets/image-hash123.jpg
```

### Reference Format
- Uses relative paths from `/public` directory
- Compatible with Next.js static asset serving
- Maintains original alt text in Markdown

## Directory Structure

```
public/
└── assets/
    ├── vacation-photo-abc12345.jpg
    ├── diagram-1-def67890.png
    └── filename-mapping.json
```

## Mapping File

A JSON file tracks the relationship between original and processed images:

```json
{
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "outputDir": "public/assets",
  "mappings": [
    {
      "original": "https://example.com/vacation.jpg",
      "new": "vacation-photo-abc12345.jpg",
      "url": "https://example.com/vacation.jpg"
    }
  ]
}
```

## Performance Considerations

### Concurrent Downloads
- Downloads run sequentially to avoid rate limiting
- Future enhancement: configurable concurrency limits

### Caching
- Skips download if file already exists
- Uses filename hash for cache validation

### Large Files
- No size limits (rely on Notion's file size constraints)
- Consider adding size limits for very large images

## Troubleshooting

### Common Issues

1. **Images not downloading**
   - Check network connectivity
   - Verify URLs are accessible
   - Check Notion sharing permissions

2. **Invalid image files**
   - Corrupted downloads
   - Unsupported formats
   - File validation failures

3. **Path replacement issues**
   - Regex matching problems
   - Special characters in URLs
   - Nested content structures

### Debug Information

Enable detailed logging to track:
- URLs found during extraction
- Download progress and status
- File validation results
- Content replacement operations

## Integration with Notion

### Image Access
- Notion images require proper authentication
- Integration must have page access permissions
- Temporary URLs may expire

### Rate Limiting
- Notion API has rate limits
- Image downloads may be throttled
- Consider queuing for large batches

## Future Enhancements

### Planned Features
- Image optimization (compression, resizing)
- Format conversion (WebP, AVIF)
- Lazy loading attributes
- Alt text generation with AI
- Batch processing improvements

### Configuration Options
- Custom output directories
- Image quality settings
- Size limits and filters
- CDN integration