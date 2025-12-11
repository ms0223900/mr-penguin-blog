# Notion 到 Strapi 轉換工作流程

## 流程圖

```
┌─────────────────┐
│  Notion 文章    │
│  (提供 URL)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 使用 Notion MCP │
│ fetchNotionPage │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  獲取頁面內容   │
│  - 標題         │
│  - 內容         │
│  - 圖片 URL     │
│  - 建立時間     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 下載圖片到本地  │
│ download-notion-│
│ images.mjs      │
│  - 提取圖片 URL │
│  - 下載圖片     │
│  - 生成檔名對照 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 根據 BLOG_PRD   │
│ 規格書格式化    │
│  - Article ID   │
│  - Title        │
│  - SubTitle     │
│  - Description  │
│  - Content      │
│  (替換圖片 URL) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 生成 JSON 檔案  │
│ blog/docs/      │
│ {articleId}.json │
│ (包含本地圖片路徑)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 執行建立腳本    │
│ create-article- │
│ script.js       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 建立 Strapi     │
│ 文章 (GraphQL)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 觸發 Webhook    │
│ 重新生成網站    │
└─────────────────┘
```

## 詳細步驟

### 步驟 1：獲取 Notion 文章

**工具**：Notion MCP `fetchNotionPage`

**輸入**：Notion 頁面 URL
```
https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8
```

**輸出**：Notion 頁面資料物件
```javascript
{
  metadata: { type: "page" },
  title: "文章標題",
  url: "https://www.notion.so/...",
  text: "完整的文章內容（Markdown 格式）",
  properties: {
    "Created time": "2025-12-05T01:17:51.475Z",
    "Name": "文章標題",
    // ... 其他屬性
  }
}
```

### 步驟 1.5：下載 Notion 圖片到本地

**工具**：`scripts/download-notion-images.mjs`

**輸入**：Notion 頁面內容（從步驟 1 獲取）

**處理流程**：

1. **提取圖片 URL**
   - 從 Notion Markdown 內容中找出所有 `<image source="..." />` 標籤
   - 提取圖片 URL（通常是 AWS S3 的臨時 URL）

2. **下載圖片**
   - 將圖片下載到 `public/assets/` 目錄
   - 圖片檔名格式：`{原檔名}-{hash}.{副檔名}`
     - 原檔名：從 URL 提取的檔名（例如：`screenshot.png`）
     - hash：URL 的 MD5 hash 前 8 個字元（例如：`a1b2c3d4`）
     - 副檔名：png, jpg, jpeg, gif, webp, svg, heic, heif
   - 範例：`screenshot-a1b2c3d4.png`

3. **驗證下載**
   - 檢查檔案是否成功下載
   - 驗證檔案大小和格式
   - 如果檔案已存在，跳過下載

4. **生成檔名對照表**
   - 建立 `public/assets/filename-mapping.json` 檔案
   - 記錄原始檔名、新檔名和原始 URL 的對應關係
   ```json
   {
     "generatedAt": "2025-12-11T...",
     "outputDir": "/path/to/public/assets",
     "mappings": [
       {
         "original": "screenshot.png",
         "new": "screenshot-a1b2c3d4.png",
         "url": "https://prod-files-secure.s3.us-west-2.amazonaws.com/..."
       }
     ]
   }
   ```

**執行命令**：
```bash
# 方法 1: 將 Notion 內容儲存到檔案後執行
node scripts/download-notion-images.mjs --file notion-content.md

# 方法 2: 直接傳入內容（透過程式化方式）
node scripts/download-notion-images.mjs --content "$(echo '...')"

# 自訂輸出目錄
node scripts/download-notion-images.mjs --file notion-content.md --output public/custom-assets
```

**輸出範例**：
```
📄 從文件讀取內容: notion-content.md

🔍 正在提取圖片 URL...
✅ 找到 3 張圖片

[1/3] 📥 下載: screenshot-a1b2c3d4.png
    原始檔名: screenshot.png
    URL: https://prod-files-secure.s3.us-west-2.amazonaws.com/...
    ✅ 下載成功 (245.32 KB)
    🔍 驗證下載...
    ✅ 驗證通過 (245.32 KB)

============================================================
📊 下載總結
============================================================
✅ 成功: 3 張
❌ 失敗: 0 張
📦 總大小: 756.18 KB
📁 輸出目錄: /path/to/public/assets

============================================================
📋 檔名匹配表（Notion 原始檔名 → 轉存檔名）
============================================================
1. screenshot.png → screenshot-a1b2c3d4.png
2. diagram.jpg → diagram-b2c3d4e5.jpg
3. logo.svg → logo-c3d4e5f6.svg
============================================================

💾 匹配表已保存至: /path/to/public/assets/filename-mapping.json
```

**注意事項**：
- Notion 圖片 URL 是臨時的（包含 AWS S3 簽名參數），需要及時下載
- 如果下載失敗，腳本會顯示錯誤訊息並繼續處理其他圖片
- 圖片檔名使用 hash 避免重複和衝突

### 步驟 2：格式化文章

**參考文件**：`blog/docs/BLOG_PRD.md`

**處理項目**：

1. **Article ID 生成**
   - 規則：小寫字母和連字符，包含關鍵字，50 字以內
   - 範例：`cursor-agent-token-consumption-issue`
   - 方法：從標題提取關鍵字，轉換為 kebab-case

2. **Title 優化**
   - 規則：SEO 最佳化，包含主要關鍵字，60 字以內
   - 方法：基於 Notion 標題，加入 SEO 關鍵字

3. **SubTitle 生成**
   - 規則：補充說明主標題，包含次要關鍵字，100 字以內
   - 方法：分析文章內容，提取核心概念，生成描述性副標題

4. **Description 生成**
   - 規則：約 50 字，包含主要關鍵字
   - 方法：從文章開頭提取或生成摘要

5. **Content 整理**
   - 規則：結構清晰（引言、主體、結論），1000-3000 字
   - 方法：
     - 保留 Notion 原始內容
     - **將 Notion 圖片 URL 替換為本地路徑**：使用 `filename-mapping.json` 將 `<image source="https://..." />` 替換為 `![alt](/assets/{新檔名})`
     - 加入引言段落
     - 確保有結論段落（如果沒有則自動生成）
     - 優化標題層級（H2, H3）

6. **publishedAt 設定**
   - 規則：使用 Notion 頁面的建立時間
   - 方法：從 `properties["Created time"]` 取得

### 步驟 3：生成 JSON 檔案

**檔案路徑**：`blog/docs/{articleId}.json`

**檔案格式**：
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

**圖片路徑替換**：
- 將 Notion 的 `<image source="https://..." />` 標籤替換為 Markdown 格式 `![alt](/assets/{新檔名})`
- 使用 `filename-mapping.json` 查找對應的新檔名
- 範例：
  ```markdown
  # 替換前（Notion 格式）
  <image source="https://prod-files-secure.s3.us-west-2.amazonaws.com/.../screenshot.png?..." />
  
  # 替換後（本地路徑）
  ![screenshot](/assets/screenshot-a1b2c3d4.png)
  ```

**替換邏輯**：
```javascript
// 讀取檔名對照表
const mapping = JSON.parse(fs.readFileSync('public/assets/filename-mapping.json'));

// 替換圖片 URL
let content = notionContent;
mapping.mappings.forEach(({ url, new: newFilename }) => {
  // 將 Notion 圖片標籤替換為 Markdown 圖片語法
  const notionImageRegex = new RegExp(`<image\\s+source="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g');
  content = content.replace(notionImageRegex, `![image](/assets/${newFilename})`);
});
```

### 步驟 4：建立 Strapi 文章

**執行命令**：
```bash
node create-article-script.js blog/docs/{articleId}.json
```

**腳本功能**：
1. 讀取並驗證 JSON 檔案
2. 顯示文章資訊
3. 呼叫 `createArticle` 函式
4. 顯示建立結果

**GraphQL Mutation**：
```graphql
mutation CreateArticle($data: ArticleInput!) {
  createArticle(data: $data) {
    data {
      id
      attributes {
        title
        subTitle
        articleId
        publishedAt
      }
    }
  }
}
```

### 步驟 5：觸發網站重新生成

**Webhook URL**：
```
https://api.vercel.com/v1/integrations/deploy/prj_AP3UL4xFT0PGsMZ2UuWU2qrKt6Xv/hOCibgPptR
```

**執行方式**：
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_AP3UL4xFT0PGsMZ2UuWU2qrKt6Xv/hOCibgPptR
```

**回應**：
```json
{
  "job": {
    "id": "wMCYDZGv737A40RSwFUU",
    "state": "PENDING",
    "createdAt": 1764920153398
  }
}
```

## 錯誤處理

### 常見錯誤類型

1. **Notion MCP 連線錯誤**
   - 原因：Notion MCP 未設定或認證失敗
   - 處理：檢查 MCP 設定和認證狀態

2. **JSON 格式錯誤**
   - 原因：生成的 JSON 不符合格式要求
   - 處理：檢查 BLOG_PRD 規格書，確保所有必要欄位都存在

3. **Strapi API 錯誤**
   - 原因：API 端點錯誤、認證失敗或資料格式不符
   - 處理：檢查環境變數、API Token 和資料格式

4. **Webhook 觸發失敗**
   - 原因：網路連線問題或 Webhook URL 錯誤
   - 處理：檢查網路連線和 Webhook URL

### 除錯步驟

1. **檢查環境變數**
   ```bash
   # 確認 .env 檔案存在且包含必要變數
   cat .env | grep STRAPI
   ```

2. **測試 Notion MCP**
   ```bash
   # 在 Claude 中測試 Notion MCP 工具
   ```

3. **驗證 JSON 檔案**
   ```bash
   # 檢查 JSON 檔案格式
   cat blog/docs/{articleId}.json | jq .
   ```

4. **測試 Strapi API**
   ```bash
   # 使用 GraphQL Playground 測試 API
   ```

## 效能優化

1. **批次處理**：如果需要處理多篇文章，可以建立批次腳本
2. **快取機制**：已處理的文章可以快取，避免重複處理
3. **非同步處理**：Webhook 觸發可以非同步執行，不阻塞主流程

## 安全性考量

1. **API Token**：確保 API Token 不會洩露到版本控制系統
2. **輸入驗證**：驗證 Notion URL 格式，防止惡意輸入
3. **權限控制**：確保只有授權的使用者可以執行轉換流程
