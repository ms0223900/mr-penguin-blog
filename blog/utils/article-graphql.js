const { API_TOKEN, STRAPI_URL } = require('./config');

/**
 * Strapi GraphQL Article Management Functions
 * 用於透過 GraphQL API 新增、更新和管理文章
 * 
 * 支援從 Notion 頁面自動建立 Strapi 文章
 * 參考：https://www.notion.so/penguin-cho/Notion-MCP-2bfd5e29c68d80c686becb109ee145ce
 */

/**
 * 從 Notion 頁面內容提取文章資料
 * @param {Object} notionPage - Notion 頁面資料（從 MCP fetch 工具取得）
 * @param {Object} options - 選項
 * @param {string} options.articleIdPrefix - 文章 ID 前綴
 * @returns {Object} Strapi 文章資料格式
 */
const extractArticleDataFromNotion = (notionPage, options = {}) => {
  const { articleIdPrefix = 'notion' } = options;

  // 從 Notion 頁面提取標題
  const title = notionPage.title || notionPage.properties?.Name || '未命名文章';

  // 從 Notion 內容提取文字
  const content = notionPage.text || notionPage.content || '';

  // 生成唯一文章 ID
  const articleId = `${articleIdPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // 從內容中提取描述（取前 200 字）
  const description = content
    .replace(/#{1,6}\s+/g, '') // 移除標題標記
    .replace(/\*\*|\*|~~|`/g, '') // 移除格式標記
    .substring(0, 200)
    .trim() + (content.length > 200 ? '...' : '');

  // 提取 URL（如果有）
  const url = notionPage.url || notionPage.properties?.url || '';

  return {
    title,
    subTitle: notionPage.properties?.subTitle || '',
    content: content,
    description,
    articleId,
    thumbnailUrl: notionPage.properties?.thumbnailUrl || '',
    thumbnail: [],
    article_tags: [],
    publishedAt: new Date().toISOString()
  };
};

/**
 * 從 Notion 頁面建立 Strapi 文章
 * 
 * 此函式遵循「極速筆記寫作法」：
 * 1. 在 Cursor 的提示框或 markdown 檔案中快速打草稿
 * 2. 請 Agent 呼叫 MCP 工具直接新增或更新 Notion 筆記
 * 3. 使用此函式將 Notion 內容同步到 Strapi
 * 
 * 使用方式（在 Agent 環境中）：
 * 1. 使用 Notion MCP fetch 工具獲取頁面：fetchNotionPage(pageUrl)
 * 2. 將獲取的頁面資料傳入此函式：createArticleFromNotion(notionPageData)
 * 
 * @param {Object} notionPageData - Notion 頁面資料（從 MCP fetch 工具取得）
 * @param {Object} options - 選項
 * @param {string} options.articleIdPrefix - 文章 ID 前綴，預設為 'notion'
 * @param {string} options.strapiUrl - Strapi GraphQL 端點 URL
 * @param {string} options.apiToken - JWT 認證 token
 * @returns {Promise<Object>} 建立的文章資料
 * 
 * @example
 * // 在 Agent 環境中使用範例：
 * // 1. 先使用 Notion MCP 工具獲取頁面
 * // const notionPage = await fetchNotionPage('https://www.notion.so/...');
 * // 2. 然後呼叫此函式建立文章
 * // const article = await createArticleFromNotion(notionPage);
 */
const createArticleFromNotion = async (notionPageData, options = {}) => {
  const {
    articleIdPrefix = 'notion',
    strapiUrl = STRAPI_URL,
    apiToken = API_TOKEN
  } = options;

  try {
    // 從 Notion 頁面資料提取文章資料
    const articleData = extractArticleDataFromNotion(notionPageData, { articleIdPrefix });

    console.log('Extracted article data from Notion:', {
      title: articleData.title,
      articleId: articleData.articleId,
      descriptionLength: articleData.description.length,
      contentLength: articleData.content.length
    });

    // 使用現有的 createArticle 函式建立文章
    const result = await createArticle(articleData, strapiUrl, apiToken);

    console.log('Successfully created article from Notion page:', result);

    return result;
  } catch (error) {
    console.error('Failed to create article from Notion:', error);
    throw new Error(`無法從 Notion 頁面建立文章: ${error.message}`);
  }
};

/**
 * 建立新文章
 * @param {Object} articleData - 文章資料
 * @param {string} articleData.title - 文章標題 (必填)
 * @param {string} articleData.subTitle - 文章副標題
 * @param {string} articleData.content - 文章內容 (HTML 或 Markdown)
 * @param {string} articleData.description - 文章描述
 * @param {string} articleData.articleId - 唯一文章 ID (必填)
 * @param {string} articleData.thumbnailUrl - 縮圖 URL
 * @param {Array<string>} articleData.thumbnail - 縮圖檔案 ID 陣列
 * @param {Array<string>} articleData.article_tags - 文章標籤 documentId 陣列
 * @param {string} articleData.article - 父文章 documentId
 * @param {Array<string>} articleData.related_articles - 相關文章 documentId 陣列
 * @param {string} strapiUrl - Strapi GraphQL 端點 URL
 * @param {string} apiToken - JWT 認證 token
 * @returns {Promise<Object>} 建立的文章資料
 */
const createArticle = async (articleData, strapiUrl = STRAPI_URL, apiToken = API_TOKEN) => {
  const query = `
    mutation CreateArticle($data: ArticleInput!) {
      createArticle(data: $data) {
        data {
          id
          attributes {
            
            title
            subTitle
            content
            description
            articleId
            thumbnailUrl
            publishedAt
            createdAt
            updatedAt
            thumbnail {
              data {
                id
                attributes {
                  
                  name
                  url
                  mime
                  size
                }
              }
            }
            article_tags {
              data {
                id
                attributes {
                  
                  title
                }
              }
            }
            article {
              data {
                id
                attributes {
                  
                  title
                }
              }
            }
            related_articles {
              data {
                id
                attributes {
                  
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          data: articleData
        }
      })
    });

    const result = await response.json();

    console.debug('Create article result:', JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Create article failed:', error);
    throw error;
  }
};

/**
 * 更新文章
 * @param {string} documentId - 文章的 documentId
 * @param {Object} articleData - 要更新的文章資料
 * @param {string} strapiUrl - Strapi GraphQL 端點 URL
 * @param {string} jwtToken - JWT 認證 token
 * @returns {Promise<Object>} 更新後的文章資料
 */
const updateArticle = async (documentId, articleData, strapiUrl = STRAPI_URL, jwtToken = API_TOKEN) => {
  const query = `
    mutation UpdateArticle($documentId: ID!, $data: ArticleInput!) {
      updateArticle(documentId: $documentId, data: $data) {
        documentId
        title
        subTitle
        content
        description
        articleId
        thumbnailUrl
        thumbnail {
          documentId
          name
          url
          mime
          size
        }
        article_tags {
          documentId
          title
        }
        article {
          documentId
          title
        }
        related_articles {
          documentId
          title
        }
        publishedAt
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    documentId,
    data: articleData
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  try {
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data.updateArticle;
  } catch (error) {
    console.error('Update article failed:', error);
    throw error;
  }
};

/**
 * 刪除文章
 * @param {string} documentId - 文章的 documentId
 * @param {string} strapiUrl - Strapi GraphQL 端點 URL
 * @param {string} jwtToken - JWT 認證 token
 * @returns {Promise<Object>} 刪除結果
 */
const deleteArticle = async (documentId, strapiUrl = STRAPI_URL, jwtToken = API_TOKEN) => {
  const query = `
    mutation DeleteArticle($id: ID!) {
      deleteArticle(id: $id) {
        data {
          id
        }
      }
    }
  `;

  const variables = {
    documentId
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  try {
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data.deleteArticle;
  } catch (error) {
    console.error('Delete article failed:', error);
    throw error;
  }
};

/**
 * 取得文章列表
 * @param {Object} options - 查詢選項
 * @param {number} options.limit - 限制筆數
 * @param {number} options.start - 起始位置
 * @param {string} options.sort - 排序方式
 * @param {Object} options.filters - 過濾條件
 * @param {string} strapiUrl - Strapi GraphQL 端點 URL
 * @param {string} jwtToken - JWT 認證 token
 * @returns {Promise<Object>} 文章列表
 */
const getArticles = async (options = {}, strapiUrl = STRAPI_URL, jwtToken = API_TOKEN) => {
  // const { limit = 10, start = 0, sort = 'createdAt:desc', filters = {} } = options;

  const query = `
    query GetArticles {
      articles {
        data {
          id
          attributes {
            title
            subTitle
            description
            articleId
            thumbnailUrl
            publishedAt
            createdAt
            updatedAt
            thumbnail {
              data {
                id
                attributes {
                  name
                  url
                  mime
                  size
                }
              }
            }
            article_tags {
              data {
                id
                attributes {
                  title
                }
              }
            }
            article {
              data {
                id
                attributes {
                  title
                }
              }
            }
            related_articles {
              data {
                id
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    // limit,
    // start,
    // sort: [sort],
    // filters
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  try {
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Get articles failed:', error);
    throw error;
  }
};

const exampleCreateFromNotion = async (notionPageData) => {
  try {
    // 模擬 Notion 頁面資料結構（實際使用時應從 MCP fetch 工具獲取）
    const mockNotionPage = notionPageData || {
      title: "Notion MCP 自動化攻略",
      url: "https://www.notion.so/penguin-cho/Notion-MCP-2bfd5e29c68d80c686becb109ee145ce",
      text: `## 重點
### ** 更新頁面的標準流程 **：\`fetch\` 獲取內容 → \`update\` 執行修改
- **常見問題**：使用 Auto 或 Composer 1 模型時，經常會卡在 id 參數錯誤的無限循環裡。
- **極速筆記寫作法**：在 Cursor 的提示框或 markdown 檔案中快速打草稿，請 Agent 呼叫 MCP 工具直接新增或更新 Notion 筆記。`,
      properties: {
        Name: "Notion MCP 自動化攻略",
        url: "https://www.notion.so/penguin-cho/Notion-MCP-2bfd5e29c68d80c686becb109ee145ce"
      }
    };

    const article = await createArticleFromNotion(mockNotionPage, {
      articleIdPrefix: 'notion-mcp'
    });

    console.log('Created article from Notion:', article);
    return article;
  } catch (error) {
    console.error('Example create from Notion failed:', error);
    throw error;
  }
};

// 使用範例
const exampleUsage = async () => {
  try {
    // 新增文章範例
    const newArticle = await createArticle({
      title: "我的第一篇文章" + Math.random().toString(36).substring(2, 5),
      subTitle: "這是一個測試文章",
      content: "<h1>歡迎閱讀</h1><p>這是文章內容...</p>",
      description: "這篇文章的簡短描述",
      articleId: "my-first-article-2025-" + new Date().toISOString(), // 日期與時間
      thumbnailUrl: "https://example.com/image.jpg",
      thumbnail: [], // 如果有檔案 ID，可以放在這裡
      article_tags: [], // 如果有標籤 documentId，可以放在這裡
      publishedAt: new Date().toISOString() // 設定為現在時間來發布
    });

    console.log('Created article:', newArticle);

    // // 取得文章列表範例
    // const articles = await getArticles({
    //   limit: 5,
    //   sort: 'createdAt:desc'
    // });

    // console.log('Articles:', articles);

  } catch (error) {
    console.error('Example usage failed:', error);
  }
};

// exampleUsage();
// exampleCreateFromNotion();
(async () => {
  const articles = (await getArticles()).articles.data;
  console.log('Articles:', articles.map(article => article.attributes.title));
})();

module.exports = {
  createArticle,
  createArticleFromNotion,
  updateArticle,
  deleteArticle,
  getArticles,
  extractArticleDataFromNotion,
  exampleUsage,
  exampleCreateFromNotion
};
