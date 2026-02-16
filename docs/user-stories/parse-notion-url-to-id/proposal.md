# Notion URL 轉換為 Notion ID

## 流程
1. 提供一串 Notion URL，例如：https://www.notion.so/{workspace-name}/{page-title}
2. 轉換為 Notion ID，例如：`2c0d5e29-c68d-8181-b94e-ea22a921d6b8`
3. 主要作法：
  - 取得 page-title 後，用 `-` 分隔，取得其中最後一串字串，例如：`文章標題-a-b-c-2c0d5e29c68d8181b94eea22a921d6b8` -> `2c0d5e29c68d8181b94eea22a921d6b8`
  - 以 8,4,4,4,12 的 UUID v4 格式分隔此字串，轉換為 UUID v4 格式
  - 例如：`2c0d5e29c68d8181b94eea22a921d6b8` -> `2c0d5e29-c68d-8181-b94e-ea22a921d6b8`

## 輸入
- Notion URL

## 輸出
- Notion ID

## 範例
1. 提供一串 Notion URL，例如：https://www.notion.so/penguin-cho/文章標題-2c0d5e29c68d8181b94eea22a921d6b8
2. 轉換為 Notion ID，例如：`2c0d5e29-c68d-8181-b94e-ea22a921d6b8`