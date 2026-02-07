import { getAllArticles, getArticleById } from "@/lib/content/article.repository";
import ArticleMapper from "@/lib/content/articleMapper";
import { SinglePost } from "common-types";

interface ArticleQueryService {
  getArticleById(articleId: string): SinglePost;

  getArticleList(limit?: number, offset?: number): SinglePost[];

  getArticleListByTag(tag: string): SinglePost[];

  getReadMoreArticleList(articleId: string): SinglePost[];
}

class ArticleQueryServiceImpl implements ArticleQueryService {
  getArticleList(limit: number = -1, offset: number = 0): SinglePost[] {
    const articles = getAllArticles();

    return articles.slice(offset, offset + limit).map(ArticleMapper.toPost);
  }

  getArticleListByTag(tag: string): SinglePost[] {
    const articles = this.getArticleList();

    return articles.filter((a) => a.tagList.includes(tag));
  }

  getArticleById(articleId: string): SinglePost {
    const article = getArticleById(articleId);

    if (!article) {
      throw new Error(`Article with id ${articleId} not found`);
    }

    return ArticleMapper.toPost(article);
  }

  getReadMoreArticleList(articleId: string): SinglePost[] {
    const articles = this.getArticleList();

    const sortedArticles = articles.sort((a, b) => Number(b.uid) - Number(a.uid));

    const greaterArticles = sortedArticles.filter((a) => Number(a.uid) > Number(articleId));

    const lessArticles = sortedArticles.filter((a) => Number(a.uid) < Number(articleId));

    return [...greaterArticles, ...lessArticles].slice(0, 3);
  }
}

export const articleQueryService = new ArticleQueryServiceImpl();