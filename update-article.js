const { updateArticle } = require('./content-pipeline/utils/article-graphql.js');
const fs = require('fs');

async function main() {
  try {
    // 讀取 JSON 文件
    const articleData = JSON.parse(fs.readFileSync('content-pipeline/docs/habitus-capital-social-cultural-communication-psychological.json', 'utf8'));

    // 找到文章的 ID（從之前的建立結果知道是 475）
    const articleId = '475'; // Strapi ID

    console.log('🆕 更新文章內容...');
    console.log(`文章 ID: ${articleId}`);
    console.log(`標題: ${articleData.title}`);

    // 更新文章 - 使用 id 而不是 documentId
    const result = await updateArticle(articleId, {
      content: articleData.content
    });

    console.log('✅ 文章更新成功!');
    console.log('📝 更新結果:', result);

  } catch (error) {
    console.error('❌ 更新文章失敗:', error.message);
    process.exit(1);
  }
}

main();