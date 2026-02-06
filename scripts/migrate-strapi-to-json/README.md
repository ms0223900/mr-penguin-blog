# Strapi → JSON 一次性遷移

將 Strapi GraphQL 的 articles 拉下來，寫入 `content/articles/*.json`（扁平結構、無 Strapi 欄位）。

## 使用方式

1. 安裝依賴（若尚未安裝）  
   `npm install` 或 `pnpm install`

2. 設定環境變數（可選）  
   - `STRAPI_ENDPOINT`：GraphQL 網址，預設 `http://localhost:1337/graphql`  
   - `STRAPI_TOKEN`：若 Strapi 需要 Bearer token 再設

3. 執行遷移  
   ```bash
   STRAPI_ENDPOINT=https://your-strapi/graphql npm run migrate
   ```
   或本地 Strapi：  
   ```bash
   npm run migrate
   ```

4. 產出目錄  
   `content/articles/<articleId>.json`

之後可改由 **Content Layer**（`lib/content/article.repository.ts`）讀取，不再依賴 Strapi runtime。
