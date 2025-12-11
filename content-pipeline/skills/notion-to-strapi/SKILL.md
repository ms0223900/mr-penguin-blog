# Notion 到 Strapi 文章轉換技能

## 概述

這個技能幫助你將 Notion 頁面中的文章內容自動轉換為 Strapi CMS 中的部落格文章。整個流程包括從 Notion 獲取內容、按照 SEO 規格整理格式、建立 Strapi 文章，並觸發網站重新生成。

## 功能說明

此技能能夠：

1. **從 Notion 獲取文章內容**：使用 Notion MCP 工具獲取指定頁面的完整內容
2. **自動下載圖片到本地**：將 Notion 文章中的圖片下載到 `public/assets/` 目錄，並生成檔名對照表
3. **自動格式化文章**：根據 BLOG_PRD 規格書自動生成符合 SEO 最佳化的標題、副標題、描述和文章 ID
4. **替換圖片路徑**：將文章內容中的 Notion 圖片 URL 替換為本地圖片路徑
5. **建立 Strapi 文章**：將格式化後的文章資料透過 GraphQL API 建立到 Strapi CMS
6. **觸發網站重新生成**：自動觸發 Vercel Webhook 以重新生成部落格網站

## 使用情境

- 當你在 Notion 中完成文章草稿，想要快速發布到部落格時
- 需要將 Notion 中的筆記轉換為正式的部落格文章時
- 想要自動化內容發布流程，減少手動操作時

## 前置需求

1. **Notion MCP 設定**：確保已設定並可使用 Notion MCP 工具
2. **Strapi 環境**：需要 Strapi 的 GraphQL API 端點和認證 Token
3. **環境變數**：確保 `.env` 檔案中包含必要的 Strapi 設定
4. **專案結構**：確保專案中包含以下檔案：
   - `content-pipeline/docs/BLOG_PRD.md` - 文章格式規格書
   - `create-article-script.js` - 文章建立腳本
   - `content-pipeline/utils/article-graphql.js` - GraphQL API 工具

## 使用方式

在 Cursor 中提供 Notion 頁面 URL，技能會自動完成整個轉換流程。

**快速開始**：參考 [QUICK_START.md](QUICK_START.md) 獲取詳細的使用說明

**基本流程**：
1. 獲取 Notion 頁面內容
2. 下載圖片到本地
3. SEO 格式化文章
4. 生成 JSON 檔案
5. 建立 Strapi 文章
6. 觸發網站重新生成

## 輸出格式

技能會生成一個 JSON 檔案，包含以下欄位：

- `title`: SEO 最佳化的文章標題（60 字以內）
- `subTitle`: SEO 最佳化的副標題（100 字以內）
- `content`: 完整的文章內容（包含引言、主體、結論，圖片路徑已替換為 `/assets/{檔名}`）
- `description`: SEO 描述（約 50 字）
- `articleId`: SEO 最佳化的文章 ID（小寫字母和連字符，50 字以內）
- `publishedAt`: 發布時間（使用 Notion 頁面的建立時間）

**圖片處理**：
- 所有圖片下載到 `public/assets/` 目錄
- 檔名格式：`{原檔名}-{hash}.{副檔名}`（例如：`screenshot-a1b2c3d4.png`）
- 文章內容中的圖片路徑：`/assets/{新檔名}`

## 相關資源

- **規格書**：`content-pipeline/docs/BLOG_PRD.md` - 定義文章格式標準
- **流程文件**：`content-pipeline/docs/NOTION_TO_STRAPI.md` - 詳細的轉換流程說明
- **範例檔案**：`content-pipeline/formatted-articles/sample/sample.json` - JSON 格式範例

## 注意事項

1. **Token 消耗**：使用 Agent 模式操作瀏覽器時可能消耗大量 Token，建議在簡單任務時使用手動操作
2. **內容品質**：確保 Notion 文章內容完整，技能會自動加入引言和結論，但原始內容品質會影響最終結果
3. **圖片處理**：
   - Notion 圖片 URL 是臨時的（包含 AWS S3 簽名），會在一段時間後失效
   - 圖片會自動下載到本地，並替換為本地路徑
   - 檔名使用 hash 避免重複和衝突
4. **SEO 優化**：所有生成的標題、描述和 ID 都會自動進行 SEO 最佳化
5. **錯誤處理**：如果建立失敗，請檢查 Strapi 連線狀態和環境變數設定

## 技術細節

- **Notion 整合**：使用 Notion MCP 的 `fetchNotionPage` 工具
- **圖片下載**：使用 Node.js 腳本 `scripts/download-notion-images.mjs`
- **圖片處理**：提取、下載、重命名、生成對照表、替換路徑
- **Strapi 整合**：使用 GraphQL API 的 `createArticle` mutation
- **自動化腳本**：使用 Node.js 執行 `create-article-script.js`
- **部署觸發**：使用 Vercel Webhook API

## 版本資訊

- **版本**：1.1.0
- **建立日期**：2025-12-05
- **最後更新**：2025-12-11
