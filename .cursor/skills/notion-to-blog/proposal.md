1. 以 Notion MCP 擷取特定頁面內容，並轉成指定的 json 格式以供文章上架。
2. 轉為 json 檔案之後，自動 git commit 並 git push。

## 大致步驟：

### 第一步：程序流程
- 使用 Notion MCP 擷取特定頁面內容，將 content 存成 json 的 content 欄位。（或可改用 Notion Client 來取得 content）
- 將 Notion 文章中的圖片下載到 `public/assets/` 目錄，並生成檔名對照表，修改 content 中的圖片路徑為 `public/assets/{新檔名}`。
- json 檔案存於 `content/articles/articleTemp.json`。
- 直接生成這些欄位：
  - publishedAt: {now}
  - content: {NOTION_CONTENT}
  - thumbnailUrl: {NOTION_CONTENT中的第一張圖片}
  - relatedArticleIds: {跟這篇相同tag的前三篇最新文章}

### 第二步：AI 自動判斷內容
從 Notion 獲取內容之後，請 AI 生成以下欄位至 json 檔案。
- title：生成文章標題，優先取用 Notion 頁面中的 title 欄位，如果沒有則取用 content 中的第一個 h1 標題，再沒有就 AI 生成。
- subTitle：生成文章副標題，由 AI 生成。
- articleId：根據文章標題或內容之「脈絡」生成適合 SEO 的文章 id，id 為英文。
- description：文章描述，SEO 優良的 description。
- tag：根據既有的文章聚合所有的 tag list，並從中「智慧挑選」。

### 範例
JSON 範例
```
{
  "id": 32,
  "articleId": "207-museum",
  "title": "大稻埕 207博物館",
  "subTitle": "營業至2022/08/31",
  "description": "當初來台北的原因，有一半就是衝著這個地方即將\"關門\"，八月底就要結束開放，拱手他人。",
  "publishedAt": "2022-08-23T15:53:10.969Z",
  "thumbnailUrl": "/assets/IMG_8606.jpg",
  "tags": [
    "生活雜記",
    "看展心得"
  ],
  "relatedArticles": [],
  "content": "..."
}

```

### 生成之後續行為
- 使用 git add . && git commit 並 git pull && git push。