# Notion 到 Strapi 文章轉換技能 - 使用教學

## 簡介

這個技能可以幫助你將 Notion 中的文章內容自動轉換並發布到 Strapi CMS 管理的部落格網站。整個流程完全自動化，從獲取 Notion 內容到網站重新生成，只需要一個簡單的指令。

## 快速開始

### 在 Cursor 中使用（推薦）

最簡單的方式是在 Cursor 中使用命令：

```
/notion-to-strapi https://www.notion.so/penguin-cho/文章標題-xxx
```

或使用 `@` 引用技能：

```
請使用 @blog/skills/notion-to-strapi 將這個 Notion 文章轉換為 Strapi 文章：
[Notion URL]
```

詳細說明請參考 [CURSOR_USAGE.md](CURSOR_USAGE.md)

### 1. 準備工作

在使用這個技能之前，請確保：

- ✅ 已設定 Notion MCP 工具並可正常使用
- ✅ Strapi 環境已設定完成，包含 GraphQL API 端點
- ✅ 專案根目錄有 `.env` 檔案，包含必要的環境變數
- ✅ 已安裝專案依賴（`npm install` 或 `yarn install`）

### 2. 基本使用

最簡單的使用方式就是直接告訴 Claude 你想要轉換的 Notion 文章 URL：

```
請幫我將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/你的文章標題-2c0d5e29c68d8181b94eea22a921d6b8
```

Claude 會自動執行以下步驟：

1. 使用 Notion MCP 工具獲取文章內容
2. **下載 Notion 文章中的圖片到本地**
3. 根據 BLOG_PRD 規格書整理文章格式（並將圖片路徑替換為本地路徑）
4. 生成符合 Strapi 格式的 JSON 檔案
5. 執行建立腳本將文章同步到 Strapi
6. 觸發 Webhook 重新生成網站

### 3. 完整流程說明

#### 步驟 1：獲取 Notion 文章

技能會使用 Notion MCP 的 `fetchNotionPage` 工具來獲取指定頁面的完整內容，包括：
- 頁面標題
- 頁面內容（Markdown 格式）
- 圖片 URL（`<image source="..." />` 標籤）
- 建立時間
- 其他頁面屬性

#### 步驟 1.5：下載圖片到本地

技能會自動執行 `scripts/download-notion-images.mjs` 腳本來下載文章中的圖片：

- **提取圖片**：從 Notion 內容中找出所有圖片 URL
- **下載圖片**：將圖片下載到 `public/assets/` 目錄
- **檔名格式**：`{原檔名}-{hash}.{副檔名}`（例如：`screenshot-a1b2c3d4.png`）
- **生成對照表**：建立 `filename-mapping.json` 記錄檔名對應關係

範例輸出：
```
📥 下載: screenshot-a1b2c3d4.png
    原始檔名: screenshot.png
    ✅ 下載成功 (245.32 KB)

📋 檔名匹配表
1. screenshot.png → screenshot-a1b2c3d4.png
```

#### 步驟 2：格式化文章

根據 `blog/docs/BLOG_PRD.md` 規格書，技能會自動：

- **生成 Article ID**：使用小寫字母和連字符，包含關鍵字，長度控制在 50 字以內
  - 範例：`cursor-agent-token-consumption-issue`

- **優化標題**：SEO 最佳化，包含主要關鍵字，長度控制在 60 字以內
  - 範例：`Cursor Agent 模式 Token 消耗問題：開發者必知的成本控制策略`

- **生成副標題**：補充說明主標題，包含次要關鍵字，長度控制在 100 字以內
  - 範例：`深入分析 Cursor Agent 模式的 Token 消耗機制，探討簡單操作為何消耗百萬 Token，並提供實用的成本優化建議與最佳實踐`

- **生成描述**：SEO 最佳化，約 50 字，包含主要關鍵字
  - 範例：`深入分析 Cursor Agent 模式的 Token 消耗機制，探討簡單操作為何消耗百萬 Token，並提供實用的成本優化建議`

- **整理內容**：基於 Notion 原文，加入引言和結論，確保結構清晰
  - **替換圖片路徑**：將 Notion 圖片 URL（`<image source="https://..." />`）替換為本地路徑（`![alt](/assets/{新檔名})`）

#### 步驟 3：生成 JSON 檔案

格式化後的文章會儲存為 JSON 檔案，路徑為：
```
blog/docs/{articleId}.json
```

JSON 檔案格式範例：
```json
{
  "title": "文章標題",
  "subTitle": "文章副標題",
  "content": "完整的文章內容（Markdown 格式，圖片已替換為本地路徑）",
  "description": "文章描述",
  "articleId": "article-id",
  "publishedAt": "2025-12-05T01:17:51.475Z"
}
```

**圖片路徑範例**：
```markdown
# content 欄位中的圖片格式
![screenshot](/assets/screenshot-a1b2c3d4.png)
![diagram](/assets/diagram-b2c3d4e5.jpg)
```

#### 步驟 4：建立 Strapi 文章

技能會執行以下命令來建立文章：
```bash
node create-article-script.js blog/docs/{articleId}.json
```

這個腳本會：
- 驗證 JSON 檔案格式
- 透過 GraphQL API 建立文章到 Strapi
- 顯示建立結果和文章 ID

#### 步驟 5：觸發網站重新生成

最後，技能會觸發 Vercel Webhook 來重新生成部落格網站：
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_AP3UL4xFT0PGsMZ2UuWU2qrKt6Xv/hOCibgPptR
```

## 進階使用

### 自訂文章格式

如果你想要自訂文章的某些欄位，可以在 Notion 頁面中加入特定的屬性：

- **subTitle**：在 Notion 頁面屬性中設定
- **thumbnailUrl**：在 Notion 頁面屬性中設定縮圖 URL
- **tags**：在 Notion 頁面中加入標籤（未來功能）

### 批次處理

目前技能支援一次處理一篇文章。如果需要批次處理多篇文章，可以：

1. 逐一提供 Notion 頁面 URL
2. 或使用 Notion 資料庫查詢功能獲取多個頁面

### 錯誤處理

如果轉換過程中出現錯誤，技能會：

1. 顯示錯誤訊息
2. 保留已生成的 JSON 檔案（如果有的話）
3. 提供除錯建議

常見錯誤和解決方法：

- **Notion MCP 連線失敗**：檢查 Notion MCP 設定和認證
- **Strapi API 錯誤**：檢查 `.env` 檔案中的 Strapi 設定
- **JSON 格式錯誤**：檢查生成的 JSON 檔案是否符合格式要求

## 檔案結構

技能相關的檔案結構如下：

```
blog/
├── skills/
│   └── notion-to-strapi/
│       ├── SKILL.md          # 技能說明文件
│       └── README.md          # 使用教學（本檔案）
├── docs/
│   ├── BLOG_PRD.md           # 文章格式規格書
│   └── NOTION_TO_STRAPI.md   # 轉換流程說明
├── formatted-articles/
│   └── sample/
│       └── sample.json        # JSON 格式範例
└── utils/
    └── article-graphql.js      # GraphQL API 工具
```

## 最佳實踐

1. **內容準備**：在 Notion 中完成文章草稿，確保內容完整
2. **標題優化**：使用清晰、描述性的標題，有助於 SEO
3. **內容結構**：確保文章有清晰的結構（引言、主體、結論）
4. **定期備份**：生成的 JSON 檔案會保留在 `blog/docs/` 目錄，可作為備份
5. **監控成本**：注意 Token 使用量，特別是使用 Agent 模式時

## 常見問題

### Q: 可以修改已建立的文章嗎？

A: 目前技能主要用於建立新文章。如果需要更新現有文章，可以：
1. 在 Strapi 管理後台手動編輯
2. 或使用 `article-graphql.js` 中的 `updateArticle` 函式

### Q: 文章會自動發布嗎？

A: 是的，文章建立後會自動設定 `publishedAt` 時間，並觸發網站重新生成。

### Q: 如何處理文章中的圖片？

A: 技能會自動處理圖片：
1. 從 Notion 頁面中提取所有圖片 URL
2. 下載圖片到 `public/assets/` 目錄
3. 檔名格式：`{原檔名}-{hash}.{副檔名}`
4. 在文章內容中將 Notion 圖片 URL 替換為本地路徑 `/assets/{新檔名}`
5. 生成 `filename-mapping.json` 記錄檔名對應關係

**注意**：Notion 圖片 URL 是臨時的（包含 AWS S3 簽名），所以需要及時下載保存到本地。

### Q: 可以自訂文章 ID 嗎？

A: 文章 ID 會根據標題自動生成，確保 SEO 最佳化。如果需要自訂，可以手動修改生成的 JSON 檔案。

## 技術支援

如果遇到問題，請檢查：

1. **環境變數**：確保 `.env` 檔案設定正確
2. **依賴套件**：執行 `npm install` 確保所有套件已安裝
3. **API 連線**：測試 Strapi GraphQL API 是否可正常連線
4. **Notion MCP**：確認 Notion MCP 工具可正常使用

## 更新日誌

- **v1.0.0** (2025-12-05)
  - 初始版本發布
  - 支援基本的 Notion 到 Strapi 轉換流程
  - 自動 SEO 優化
  - 自動觸發網站重新生成

## 參考資料

- [Claude Skills 官方文件](https://claude.com/blog/skills)
- [BLOG_PRD 規格書](../docs/BLOG_PRD.md)
- [NOTION_TO_STRAPI 流程說明](../docs/NOTION_TO_STRAPI.md)
