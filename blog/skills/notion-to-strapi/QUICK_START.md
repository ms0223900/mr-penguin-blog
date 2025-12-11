# 快速開始指南

## 30 秒快速開始

### 在 Cursor 中使用（最簡單）

只需要在 Cursor 中輸入：

```
/notion-to-strapi https://www.notion.so/penguin-cho/你的文章標題-xxx
```

或者使用 `@` 引用：

```
請使用 @blog/skills/notion-to-strapi 將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/你的文章標題-xxx
```

AI 會自動完成所有步驟！

## 完整流程（自動執行）

1. ✅ 獲取 Notion 文章內容
2. ✅ 自動格式化（SEO 優化）
3. ✅ 生成 JSON 檔案
4. ✅ 建立 Strapi 文章
5. ✅ 觸發網站重新生成

## 前置檢查清單

使用前請確認：

- [ ] Notion MCP 已設定並可正常使用
- [ ] Strapi 環境變數已設定（`.env` 檔案）
- [ ] 專案依賴已安裝（`npm install`）
- [ ] 相關檔案存在：
  - [ ] `blog/docs/BLOG_PRD.md`
  - [ ] `create-article-script.js`
  - [ ] `blog/utils/article-graphql.js`
  - [ ] `.cursor/commands/notion-to-strapi.md`（Cursor Command）

## 在 Cursor 中的使用方式

### 方法 1：使用 Command（推薦）

在 Cursor 中按 `Cmd+L` (Mac) 或 `Ctrl+L` (Windows) 開啟命令面板，輸入：

```
/notion-to-strapi https://www.notion.so/.../xxx
```

### 方法 2：使用 @ 引用

在 Cursor 的提示框中，使用 `@` 符號引用技能：

```
請使用 @blog/skills/notion-to-strapi 將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/.../xxx
```

### 方法 3：直接描述需求

直接告訴 Claude 你想要轉換 Notion 文章：

```
請幫我將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/.../xxx

請參考 @blog/skills/notion-to-strapi 的技能說明來執行。
```

## 常見問題快速解答

**Q: 需要手動執行任何命令嗎？**  
A: 不需要！Claude 會自動執行所有必要的命令。

**Q: 文章會自動發布嗎？**  
A: 是的，文章建立後會自動設定發布時間並觸發網站重新生成。

**Q: 可以修改生成的內容嗎？**  
A: 可以，在建立前可以要求 Claude 調整任何欄位。

**Q: 如果出錯怎麼辦？**  
A: Claude 會顯示錯誤訊息，並提供除錯建議。檢查環境變數和連線狀態。

**Q: 如何在 Cursor 中使用？**  
A: 有三種方式：
1. 使用 `/notion-to-strapi` 命令
2. 使用 `@blog/skills/notion-to-strapi` 引用
3. 直接描述需求並引用技能

## 進階使用

### 自訂格式

```
/notion-to-strapi https://www.notion.so/.../xxx

請使用以下副標題：「我的自訂副標題」
```

### 批次處理

```
請使用 @blog/skills/notion-to-strapi 將以下 Notion 文章都轉換為 Strapi 文章：
1. https://www.notion.so/.../文章1
2. https://www.notion.so/.../文章2
3. https://www.notion.so/.../文章3
```

## 需要更多幫助？

- 📖 [完整使用教學](README.md)
- 🔄 [工作流程說明](workflow.md)
- 💡 [使用範例](examples.md)
- 📋 [技能說明文件](SKILL.md)
