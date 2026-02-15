/**
 * AI Content Analyzer for Notion to Blog Converter
 *
 * Uses AI to analyze and enhance article content with titles, descriptions, and tags.
 */

export interface ContentAnalysisInput {
  title: string;
  content: string;
  existingTags: string[];
}

export interface ContentAnalysisResult {
  title: string;
  subTitle: string;
  description: string;
  articleId: string;
  tags: string[];
}

export class AIContentAnalyzer {
  /**
   * Analyze content and generate enhanced metadata
   */
  async analyzeContent(input: ContentAnalysisInput): Promise<ContentAnalysisResult> {
    // Note: This is a placeholder implementation.
    // In a real implementation, you would integrate with an AI service like OpenAI, Claude, etc.

    console.log('🤖 AI Content Analysis (simulated)');

    // Simulate AI processing time
    await this.delay(1000);

    // For now, return basic enhanced content
    // In real implementation, this would call an AI API
    const result = this.simulateAIAnalysis(input);

    return result;
  }

  /**
   * Simulate AI analysis (placeholder implementation)
   * Replace this with actual AI service integration
   */
  private simulateAIAnalysis(input: ContentAnalysisInput): ContentAnalysisResult {
    const { title, content, existingTags } = input;

    // Enhanced title (if needed)
    let enhancedTitle = title;
    if (!title || title === 'Untitled Article') {
      // Extract from first heading or generate
      const lines = content.split('\n');
      const firstHeading = lines.find(line => line.startsWith('# '));
      enhancedTitle = firstHeading ? firstHeading.substring(2).trim() : 'Generated Title from Content';
    }

    // Generate subtitle
    const subTitle = this.generateSubtitle(content);

    // Generate description
    const description = this.generateDescription(content);

    // Generate article ID
    const articleId = this.generateArticleId(enhancedTitle);

    // Select relevant tags
    const tags = this.selectRelevantTags(content, existingTags);

    return {
      title: enhancedTitle,
      subTitle,
      description,
      articleId,
      tags,
    };
  }

  /**
   * Generate an engaging subtitle
   */
  private generateSubtitle(content: string): string {
    // Extract first meaningful paragraph
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
    if (paragraphs.length > 0) {
      const firstPara = paragraphs[0].substring(0, 100);
      return firstPara.endsWith('.') ? firstPara : firstPara + '...';
    }

    return 'An insightful exploration of interesting topics';
  }

  /**
   * Generate SEO-friendly description
   */
  private generateDescription(content: string): string {
    // Extract first 150-160 characters for SEO
    const cleanContent = content.replace(/[#*`]/g, '').trim();
    if (cleanContent.length <= 160) {
      return cleanContent;
    }

    // Find a good break point
    let description = cleanContent.substring(0, 157);
    const lastSpace = description.lastIndexOf(' ');

    if (lastSpace > 120) {
      description = description.substring(0, lastSpace);
    }

    return description + '...';
  }

  /**
   * Generate SEO-friendly article ID
   */
  private generateArticleId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Select relevant tags from existing tags based on content
   */
  private selectRelevantTags(content: string, existingTags: string[]): string[] {
    if (existingTags.length === 0) {
      return ['general'];
    }

    const selectedTags: string[] = [];
    const contentLower = content.toLowerCase();

    // Simple keyword matching (in real AI, this would be semantic matching)
    const keywordMappings: { [key: string]: string[] } = {
      'travel': ['travel', '旅遊', 'journey', 'trip'],
      'food': ['food', 'cooking', 'recipe', 'restaurant', '美食'],
      'technology': ['tech', 'programming', 'software', 'code', '科技'],
      'life': ['life', 'daily', '生活', '日常'],
      'design': ['design', 'ui', 'ux', 'creative', '設計'],
      'business': ['business', 'startup', 'company', '商業'],
      'health': ['health', 'fitness', 'wellness', '健康'],
      'education': ['education', 'learning', 'study', '教育'],
    };

    for (const [tag, keywords] of Object.entries(keywordMappings)) {
      if (existingTags.includes(tag)) {
        const hasKeyword = keywords.some(keyword => contentLower.includes(keyword));
        if (hasKeyword && selectedTags.length < 3) {
          selectedTags.push(tag);
        }
      }
    }

    // If no tags matched, select some popular ones
    if (selectedTags.length === 0) {
      const defaultTags = existingTags.slice(0, 2);
      selectedTags.push(...defaultTags);
    }

    return selectedTags.length > 0 ? selectedTags : ['general'];
  }

  /**
   * Simulate processing delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Example of how to integrate with a real AI service
 * Uncomment and modify this when you have an AI API key
 */

/*
// Example OpenAI integration
import OpenAI from 'openai';

export class OpenAIAnalyzer extends AIContentAnalyzer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    super();
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeContent(input: ContentAnalysisInput): Promise<ContentAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(input);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return this.parseAIResponse(response.choices[0].message.content || '');
  }

  private buildAnalysisPrompt(input: ContentAnalysisInput): string {
    return `Analyze this article content and provide metadata in JSON format:

Content: ${input.content.substring(0, 2000)}

Existing tags: ${input.existingTags.join(', ')}

Please provide:
1. An engaging title (if current title "${input.title}" needs improvement)
2. A compelling subtitle
3. An SEO-friendly description (150-160 characters)
4. A URL-friendly article ID
5. 2-3 relevant tags from the existing tags list

Return only valid JSON with keys: title, subTitle, description, articleId, tags`;
  }

  private parseAIResponse(response: string): ContentAnalysisResult {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || '',
        subTitle: parsed.subTitle || '',
        description: parsed.description || '',
        articleId: parsed.articleId || '',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }
}
*/