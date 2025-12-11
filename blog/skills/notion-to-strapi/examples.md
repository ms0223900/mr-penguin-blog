# 使用範例

## 範例 1：基本使用

### 輸入
```
請幫我將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/Cursor-Agent-Token-2c0d5e29c68d8181b94eea22a921d6b8
```

### 處理過程

1. **獲取 Notion 內容**
   - 使用 Notion MCP 工具獲取頁面
   - 提取標題：`Cursor Agent 模式 Token 消耗問題`
   - 提取內容：完整的 Markdown 格式文章
   - 提取建立時間：`2025-12-05T01:17:51.475Z`

2. **格式化文章**
   - Article ID: `cursor-agent-token-consumption-issue`
   - Title: `Cursor Agent 模式 Token 消耗問題：開發者必知的成本控制策略`
   - SubTitle: `深入分析 Cursor Agent 模式的 Token 消耗機制，探討簡單操作為何消耗百萬 Token，並提供實用的成本優化建議與最佳實踐`
   - Description: `深入分析 Cursor Agent 模式的 Token 消耗機制，探討簡單操作為何消耗百萬 Token，並提供實用的成本優化建議`
   - Content: 加入引言和結論的完整文章內容

3. **生成 JSON 檔案**
   - 路徑：`blog/docs/cursor-agent-token-consumption-issue.json`
   - 格式：符合 Strapi 要求的 JSON 格式

4. **建立 Strapi 文章**
   - 執行：`node create-article-script.js blog/docs/cursor-agent-token-consumption-issue.json`
   - 結果：文章 ID 281 建立成功

5. **觸發網站重新生成**
   - Webhook 觸發成功
   - 部署任務狀態：PENDING

### 輸出
```
✅ 文章建立成功!
📝 文章 ID: 281
```

## 範例 2：自訂格式

### 輸入
```
請幫我將這個 Notion 文章轉換為 Strapi 文章，並使用自訂的副標題：
https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8

副標題：這是我自訂的副標題內容
```

### 處理方式

如果 Notion 頁面中有 `subTitle` 屬性，技能會優先使用該屬性值。否則會根據內容自動生成。

## 範例 3：批次處理

### 輸入
```
請幫我將以下 Notion 文章都轉換為 Strapi 文章：
1. https://www.notion.so/penguin-cho/文章1-xxx
2. https://www.notion.so/penguin-cho/文章2-yyy
3. https://www.notion.so/penguin-cho/文章3-zzz
```

### 處理方式

技能會逐一處理每篇文章，為每篇文章：
1. 獲取 Notion 內容
2. 格式化文章
3. 生成 JSON 檔案
4. 建立 Strapi 文章
5. 最後統一觸發一次 Webhook

## 範例 4：錯誤處理

### 情境：Notion MCP 連線失敗

**錯誤訊息**：
```
❌ 建立文章失敗: Notion MCP 連線失敗
```

**處理方式**：
1. 檢查 Notion MCP 設定
2. 確認認證狀態
3. 重新嘗試獲取頁面

### 情境：Strapi API 錯誤

**錯誤訊息**：
```
❌ 建立文章失敗: GraphQL API 錯誤: Unauthorized
```

**處理方式**：
1. 檢查 `.env` 檔案中的 `STRAPI_URL` 和 `API_TOKEN`
2. 確認 API Token 是否有效
3. 檢查 Strapi 服務是否正常運行

### 情境：JSON 格式錯誤

**錯誤訊息**：
```
❌ JSON 格式錯誤: 缺少必要的 "articleId" 字段
```

**處理方式**：
1. 檢查生成的 JSON 檔案
2. 確認所有必要欄位都存在
3. 手動修正 JSON 檔案後重新執行

## 範例 5：內容優化

### 輸入：簡短的 Notion 筆記

**Notion 內容**：
```markdown
## 我的想法

今天學到了一個新概念，覺得很有趣。

### 重點

1. 概念 A
2. 概念 B
3. 概念 C
```

### 輸出：完整的部落格文章

技能會自動：
1. 加入引言段落，說明文章背景
2. 擴展內容，加入更多說明和例子
3. 加入結論段落，總結重點
4. 優化標題層級和格式

**生成的內容**：
```markdown
## 引言

在學習過程中，我們經常會遇到一些有趣的新概念...

## 我的想法

今天學到了一個新概念，覺得很有趣。這個概念不僅...

### 重點

#### 概念 A
[詳細說明...]

#### 概念 B
[詳細說明...]

#### 概念 C
[詳細說明...]

## 結論

透過這次學習，我們了解到...
```

## 最佳實踐範例

### ✅ 好的 Notion 文章結構

```markdown
# 文章標題

## 引言
[簡短說明文章背景和目的]

## 主要內容
[詳細的內容說明]

### 子標題 1
[內容]

### 子標題 2
[內容]

## 結論
[總結和後續行動]
```

### ❌ 不建議的結構

```markdown
# 標題

一些零散的筆記
沒有結構
缺少上下文
```

**問題**：
- 缺少結構
- 內容不完整
- 難以自動優化

## 進階使用範例

### 使用 Notion 資料庫查詢

如果你有一個 Notion 資料庫包含多篇待發布文章，可以：

1. 查詢資料庫獲取所有待發布文章
2. 逐一轉換每篇文章
3. 批次建立到 Strapi

### 整合到 CI/CD 流程

可以將這個技能整合到 CI/CD 流程中：

```yaml
# .github/workflows/notion-to-strapi.yml
name: Notion to Strapi
on:
  schedule:
    - cron: '0 0 * * *'  # 每天執行
jobs:
  convert:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Convert Notion to Strapi
        run: |
          # 執行轉換腳本
```
