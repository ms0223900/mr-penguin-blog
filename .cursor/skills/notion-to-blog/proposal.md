1. 以 Notion MCP 擷取特定頁面內容，並轉成指定的 json 格式以供文章上架。
2. 轉為 json 檔案之後，自動 git commit 並 git push。

大致步驟：
- 使用 Notion MCP 擷取特定頁面內容，將 content 存成 json 的 content 欄位。
- 將 Notion 文章中的圖片下載到 public/assets/ 目錄，並生成檔名對照表，修改 content 中的圖片路徑為 /assets/{新檔名}。
<!-- // TODO -->
- json 檔案存於 content/articles/{articleId}.json。
- 使用 git commit 並 git push。