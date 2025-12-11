# Notion 圖片下載工作流程

## 概述

此文件說明如何從 Notion 頁面讀取圖片並下載到本地專案的 `public/assets` 目錄。

## 工作流程

### 步驟 1: 讀取 Notion 頁面內容

使用 Notion MCP 工具讀取頁面內容：

```bash
# 使用 notion-fetch 工具獲取頁面內容
# 頁面 URL 範例: https://www.notion.so/penguin-cho/GTD-2025-12-2bed5e29c68d8040b86be3dc1d6bd2e6
```

### 步驟 2: 提取圖片 URL

從 Notion 頁面內容中找出 `<image>` 標籤，提取 `source` 屬性的圖片 URL。

圖片 URL 格式通常為：
```
https://prod-files-secure.s3.us-west-2.amazonaws.com/...
```

### 步驟 3: 下載圖片

使用 `curl` 命令下載圖片到 `public/assets` 目錄：

```bash
# 下載圖片並保存到 public/assets 目錄
curl -o "public/assets/圖片檔名.png" "圖片URL"
```

### 步驟 4: 驗證下載

確認圖片已成功下載：

```bash
# 檢查文件是否存在
ls -lh public/assets/圖片檔名.png
```

## 實際範例

### 範例：下載 GTD 旅遊頁面中的圖片

1. **讀取頁面**：
   - 頁面 URL: `https://www.notion.so/penguin-cho/GTD-2025-12-2bed5e29c68d8040b86be3dc1d6bd2e6`
   - 使用 `notion-fetch` 工具獲取頁面內容

2. **提取圖片 URL**：
   - 從頁面內容中找到圖片標籤：
   ```xml
   <image source="https://prod-files-secure.s3.us-west-2.amazonaws.com/.../Snipaste_2025-12-07_19-00-52.png?..."></image>
   ```

3. **下載圖片**：
   ```bash
   curl -o "public/assets/Snipaste_2025-12-07_19-00-52.png" "完整的圖片URL（包含所有參數）"
   ```

4. **驗證**：
   ```bash
   ls -lh public/assets/Snipaste_2025-12-07_19-00-52.png
   # 輸出: -rw-r--r--@ 1 penguin  staff   119K Dec 11 11:17 .../Snipaste_2025-12-07_19-00-52.png
   ```

## 注意事項

1. **圖片 URL 有效期**：
   - Notion 的圖片 URL 通常包含 AWS S3 的臨時簽名參數
   - 這些 URL 有時效性（例如 3600 秒），需要及時下載

2. **文件命名**：
   - 建議保留原始檔名，或使用有意義的檔名
   - 確保檔名不與現有文件衝突

3. **保存位置**：
   - 所有圖片統一保存在 `public/assets/` 目錄
   - 這樣可以直接在網站中使用 `/assets/圖片檔名.png` 路徑引用

4. **文件大小**：
   - 注意圖片文件大小，避免過大的圖片影響網站載入速度
   - 可考慮在保存前進行圖片壓縮

## 自動化腳本（可選）

如果需要頻繁下載 Notion 圖片，可以考慮創建一個自動化腳本：

```bash
#!/bin/bash
# download-notion-image.sh

NOTION_URL=$1
OUTPUT_DIR="public/assets"

# 1. 讀取 Notion 頁面（需要 Notion API 或 MCP 工具）
# 2. 提取圖片 URL
# 3. 下載圖片
# 4. 保存到 OUTPUT_DIR
```

## 相關工具

- **Notion MCP 工具**：`notion-fetch` - 讀取 Notion 頁面內容
- **curl**：下載圖片文件
- **ls**：驗證文件下載

## 更新記錄

- 2025-12-11: 創建初始工作流程文件

