# Notion Page Content Module

一個可重用的模組，用於查詢 Notion 頁面並提取內容。這個模組提供了三個主要組件，讓其他專案可以輕鬆整合 Notion 頁面內容處理功能。

## 功能特色

- 🔍 **頁面查詢**: 從 Notion API 獲取頁面資訊和區塊內容
- 📝 **內容提取**: 將 Notion 區塊轉換為純文字內容
- 🔧 **模組化設計**: 每個組件都有明確的職責，可以單獨使用
- 🎯 **類型安全**: 完整的 TypeScript 類型定義
- 🔄 **可重用**: 設計為可以輕鬆複製到其他專案
- 📦 **零依賴**: 僅依賴 `@notionhq/client`，沒有其他外部依賴

## 安裝

### 複製到您的專案

1. 將整個 `notion-page-content` 資料夾複製到您的專案中
2. 安裝必要的依賴：

```bash
npm install @notionhq/client
```

## 快速開始

```typescript
import {
  NotionClientService,
  PageQueryService,
  NotionContentExtractor,
  SimpleNotionConfig
} from './notion-page-content';

// 設定配置
const config = new SimpleNotionConfig('your-notion-integration-token');

// 創建服務實例
const client = new NotionClientService(config);
const queryService = new PageQueryService(client);
const extractor = new NotionContentExtractor();

// 查詢頁面並提取內容
const pageData = await queryService.getPageData('your-page-id');
const result = extractor.extractContent(pageData);

if (result.success) {
  console.log(result.data?.content);
}
```

## API 參考

### 核心服務

#### NotionClientService

負責與 Notion API 的通訊。

```typescript
const client = new NotionClientService(config, logger);

// 測試連接
await client.testConnection();

// 獲取頁面資訊
const page = await client.getPage('page-id');

// 獲取頁面區塊
const blocks = await client.getAllBlocks('page-id');
```

#### PageQueryService

負責查詢頁面資料。

```typescript
const queryService = new PageQueryService(client, logger);

// 查詢單一頁面
const pageData = await queryService.getPageData('page-id');

// 查詢多個頁面
const pagesData = await queryService.getPagesData(['id1', 'id2', 'id3']);
```

#### NotionContentExtractor

負責將 Notion 區塊轉換為純文字。

```typescript
const extractor = new NotionContentExtractor(logger);

// 提取內容
const result = extractor.extractContent(pageData);

if (result.success) {
  console.log(result.data?.content);
}
```

### 配置選項

#### SimpleNotionConfig

直接提供 token 的簡單配置。

```typescript
const config = new SimpleNotionConfig('your-token-here');
```

#### EnvNotionConfig

從環境變數讀取 token。

```typescript
const config = new EnvNotionConfig('NOTION_TOKEN'); // 預設環境變數名
```

### 自訂配置

實現 `INotionConfig` 接口：

```typescript
class CustomConfig implements INotionConfig {
  getToken(): string {
    // 您的 token 獲取邏輯
    return getTokenFromSecureStorage();
  }
}
```

## 支援的區塊類型

模組支援以下 Notion 區塊類型的內容提取：

- **文字區塊**: 段落、標題 (H1, H2, H3)
- **列表**: 項目符號列表、編號列表、待辦事項
- **程式碼**: 程式碼區塊
- **引用**: 引用文字
- **其他**: 註釋、分隔線

## 錯誤處理

所有服務都包含適當的錯誤處理：

```typescript
try {
  const pageData = await queryService.getPageData('page-id');
  const result = extractor.extractContent(pageData);

  if (!result.success) {
    console.error('提取失敗:', result.error);
  }
} catch (error) {
  console.error('查詢失敗:', error);
}
```

## 日誌支援

可以提供自訂的 logger：

```typescript
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  success: (msg: string) => console.log(`[SUCCESS] ${msg}`)
};

const client = new NotionClientService(config, logger);
```

## 範例

查看 `example.ts` 檔案獲取完整的使用範例，包括：

- 基本使用方式
- 環境變數配置
- 自訂 logger
- 批量處理和錯誤處理

## 類型定義

模組導出完整的 TypeScript 類型：

```typescript
import type {
  NotionPage,
  NotionBlock,
  PageContent,
  PageContentResult,
  INotionClientService,
  IPageQueryService,
  IContentExtractor
} from './notion-page-content';
```

## 架構設計

```
notion-page-content/
├── index.ts           # 主要導出
├── types.ts           # 類型定義
├── notion-client.ts   # API 客戶端
├── page-query.ts      # 頁面查詢服務
├── content-extractor.ts # 內容提取器
├── example.ts         # 使用範例
└── README.md          # 文檔
```

## 授權

此模組遵循與原始專案相同的授權條款。