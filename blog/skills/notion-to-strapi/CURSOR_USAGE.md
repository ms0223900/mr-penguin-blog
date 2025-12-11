# 在 Cursor 中使用 Notion 到 Strapi 轉換技能

## 快速開始

在 Cursor 中使用這個技能有三種方式：

### 方法 1：使用 Cursor Command（推薦）

1. 在 Cursor 中按 `Cmd+L` (Mac) 或 `Ctrl+L` (Windows) 開啟命令面板
2. 輸入 `/notion-to-strapi`
3. 在提示框中輸入 Notion 頁面 URL

**範例**：
```
/notion-to-strapi https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8
```

### 方法 2：使用 @ 引用技能

在 Cursor 的提示框中，使用 `@` 符號引用技能：

```
請使用 @blog/skills/notion-to-strapi 將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/文章標題-xxx
```

### 方法 3：直接描述需求

直接告訴 Claude 你想要轉換 Notion 文章：

```
請幫我將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/文章標題-xxx

請參考 @blog/skills/notion-to-strapi 的技能說明來執行。
```

## 使用步驟詳解

### 步驟 1：準備 Notion 文章 URL

確保你有一個可訪問的 Notion 頁面 URL，格式通常為：
```
https://www.notion.so/{workspace}/{page-title}-{page-id}
```

### 步驟 2：在 Cursor 中執行命令

選擇上述三種方法中的任一種，提供 Notion URL。

### 步驟 3：等待處理完成

Claude 會自動執行以下操作：
1. ✅ 獲取 Notion 文章內容
2. ✅ 格式化文章（SEO 優化）
3. ✅ 生成 JSON 檔案
4. ✅ 建立 Strapi 文章
5. ✅ 觸發網站重新生成

### 步驟 4：確認結果

處理完成後，你會看到：
- 文章建立成功的訊息
- Strapi 文章 ID
- Webhook 觸發狀態

## 進階使用

### 自訂格式

如果你想要自訂某些欄位，可以在命令中說明：

```
/notion-to-strapi https://www.notion.so/.../xxx

請使用以下副標題：「我的自訂副標題」
```

### 批次處理

可以一次處理多篇文章：

```
請使用 @blog/skills/notion-to-strapi 將以下 Notion 文章都轉換為 Strapi 文章：

1. https://www.notion.so/.../文章1
2. https://www.notion.so/.../文章2
3. https://www.notion.so/.../文章3
```

### 只生成 JSON 不建立文章

如果你只想生成 JSON 檔案而不立即建立到 Strapi：

```
請使用 @blog/skills/notion-to-strapi 將這個 Notion 文章轉換為 JSON 格式，
但不要建立到 Strapi：
https://www.notion.so/.../xxx
```

## 常見問題

### Q: 命令找不到？

**A**: 確保 `.cursor/commands/notion-to-strapi.md` 檔案存在。如果不存在，請重新建立或檢查檔案路徑。

### Q: 如何確認技能已載入？

**A**: 在 Cursor 中使用 `@blog/skills/notion-to-strapi` 時，如果技能已正確設定，Claude 會自動參考相關文件。

### Q: 可以修改命令的行為嗎？

**A**: 可以！編輯 `.cursor/commands/notion-to-strapi.md` 檔案來自訂命令的行為。

### Q: 如何除錯？

**A**: 如果遇到問題，可以：
1. 檢查 Notion MCP 是否正常運作
2. 確認環境變數設定（`.env` 檔案）
3. 查看終端機的錯誤訊息
4. 檢查生成的 JSON 檔案格式

## 快捷鍵

- **開啟命令面板**：`Cmd+L` (Mac) 或 `Ctrl+L` (Windows)
- **開啟 AI 對話**：`Cmd+K` (Mac) 或 `Ctrl+K` (Windows)
- **引用檔案**：在提示框中輸入 `@` 然後選擇檔案

## 相關資源

- [Cursor Commands 說明](../README.md#cursor-commands)
- [技能完整文件](SKILL.md)
- [使用教學](README.md)
- [工作流程說明](workflow.md)

## 提示與技巧

1. **使用 @ 引用相關文件**：在執行命令時，可以同時引用相關文件來提供更多上下文
   ```
   @blog/docs/BLOG_PRD.md @blog/skills/notion-to-strapi
   請將這個 Notion 文章轉換為 Strapi 文章：...
   ```

2. **儲存常用命令**：可以將常用的 Notion URL 儲存在筆記中，方便快速使用

3. **檢查生成結果**：處理完成後，記得檢查生成的 JSON 檔案和 Strapi 文章是否符合預期

4. **批次處理時注意**：批次處理多篇文章時，建議先測試一篇，確認流程正常後再批次處理
