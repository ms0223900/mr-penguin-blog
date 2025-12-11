# Notion 文章轉換為 Strapi 文章
此文件說明如何將 Notion 文章轉換為 Strapi 文章。

## 概述
notion 文章經過 @BLOG_PRD 規格書的整理後，可以透過 @article-graphql.js 的 createArticleFromNotion 函式，將 Notion 文章轉換為 Strapi 文章。

## 流程
1. 使用 Notion MCP 的 fetchNotionPage 工具獲取 Notion 文章
2. **下載 Notion 文章中的圖片到本地**：
   - 從獲取的 Notion 內容中提取所有圖片 URL（`<image source="..." />` 標籤）
   - 使用 `@scripts/download-notion-images.mjs` 腳本下載圖片到 `public/assets/` 目錄
   - 圖片檔名格式：`{原檔名}-{hash}.{副檔名}`（例如：`screenshot-a1b2c3d4.png`）
   - 腳本會生成 `public/assets/filename-mapping.json` 記錄原始檔名與轉存檔名的對應關係
3. 使用 @BLOG_PRD 規格書的整理 Notion 文章為適合 Strapi 文章的資料格式，並且於 content-pipeline/docs 目錄下存成 {articleId}.json 檔案作為下一步的輸入資料。
   - **將 content 中的 Notion 圖片 URL 替換為本地圖片路徑**：使用 `/assets/{新檔名}` 格式
json 檔案範例 `@content-pipeline/formatted-articles/sample/sample.json`：
```json
{
  "title": "{notion_page_title}",
  "subTitle": "{subTitle}", // 按照 @BLOG_PRD 規格書的 subTitle 欄位生成的 subTitle
  "content": "{content}", // Notion 文章的原文，圖片路徑已替換為本地路徑 /assets/{新檔名}
  "description": "{description}", // 按照 @BLOG_PRD 規格書的 description 欄位生成的 description
  "articleId": "{articleId}", // 按照 @BLOG_PRD 規格書的 articleId 欄位生成的 articleId
  "publishedAt": "{publishedAt}" // 按照 @BLOG_PRD 規格書的 publishedAt 欄位生成的 publishedAt
}
```
4. 將上一步 json 檔案路徑作為參數，呼叫 @create-article-script.js 的 main 函式以建立 Strapi 文章。
5. 戳 Webhook 觸發部落格網站重新生成文章 https://api.vercel.com/v1/integrations/deploy/prj_AP3UL4xFT0PGsMZ2UuWU2qrKt6Xv/hOCibgPptR