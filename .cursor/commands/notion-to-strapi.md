將 Notion 文章轉換為 Strapi 部落格文章。

## 使用方式

在 Cursor 中使用此命令時，請提供 Notion 頁面的 URL。例如：

```
請使用 @content-pipeline/skills/notion-to-strapi 技能，將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8
```

或者直接使用命令：

```
/notion-to-strapi https://www.notion.so/penguin-cho/文章標題-xxx
```

## 執行流程

此命令會自動執行以下步驟：

1. 使用 Notion MCP 工具獲取頁面內容
2. **下載 Notion 文章中的圖片**：
   - 提取文章中的所有圖片 URL
   - 使用 `scripts/download-notion-images.mjs` 下載圖片到 `public/assets/` 目錄
   - 圖片檔名格式：`{原檔名}-{hash}.{副檔名}`
3. 根據 @content-pipeline/docs/FORMAT_NOTE_TO_BLOG_PRD.md 規格書整理文章格式
   - 將文章內容中的 Notion 圖片 URL 替換為本地路徑 `/assets/{新檔名}`
4. 生成符合 Strapi 格式的 JSON 檔案（儲存在 `content-pipeline/docs/{articleId}.json`）
5. 執行 `create-article-script.js` 建立 Strapi 文章
6. 觸發 Vercel Webhook 重新生成網站

## 前置需求

- Notion MCP 已設定並可正常使用
- Strapi 環境變數已設定（`.env` 檔案）
- 相關檔案存在：`content-pipeline/docs/FORMAT_NOTE_TO_BLOG_PRD.md`、`create-article-script.js`、`content-pipeline/utils/article-graphql.js`

## 相關文件

- 技能說明：@content-pipeline/skills/notion-to-strapi/SKILL.md
- 使用教學：@content-pipeline/skills/notion-to-strapi/README.md
- 工作流程：@content-pipeline/skills/notion-to-strapi/workflow.md
