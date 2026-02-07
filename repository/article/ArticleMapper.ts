import { Article } from "@/repository/article/article.types";
import { SinglePost } from "common-types";

class ArticleMapper {
  static toPost(article: Article): SinglePost {
    return {
      uid: article.id.toString(),
      createdAt: article.publishedAt,
      id: article.id.toString(),
      title: article.title,
      subTitle: article.subTitle || '',
      description: article.description || '',
      content: article.content,
      thumbnail: article.thumbnailUrl ? {
        src: article.thumbnailUrl,
      } : null,
      tagList: article.tags,
      relatedArticleList: article.relatedArticles.map((relatedArticle) => ({
        uid: relatedArticle.articleId,
        id: relatedArticle.articleId,
        title: relatedArticle.title,
        subTitle: relatedArticle.subTitle || '',
      })),
    };
  }
}

export default ArticleMapper;