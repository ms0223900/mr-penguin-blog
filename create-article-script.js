const { createArticle } = require('./blog/utils/article-graphql.js');
const fs = require('fs');
const path = require('path');

/**
 * 解析命令行參數
 * @returns {Object} 包含參數的對象
 */
function parseArguments() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    process.exit(1);
  }

  // 簡單的參數解析
  const options = {};
  let jsonFilePath = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      showUsage();
      process.exit(0);
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (!arg.startsWith('-') && !jsonFilePath) {
      jsonFilePath = arg;
    } else {
      console.error(`未知參數: ${arg}`);
      showUsage();
      process.exit(1);
    }
  }

  if (!jsonFilePath) {
    console.error('請提供 JSON 文件路徑');
    showUsage();
    process.exit(1);
  }

  return { jsonFilePath, options };
}

/**
 * 顯示使用說明
 */
function showUsage() {
  console.log(`
使用方式: node create-article-script.js [選項] <json-file-path>

參數:
  <json-file-path>    JSON 文章數據文件路徑 (必需)

選項:
  -v, --verbose       詳細輸出模式
  -h, --help          顯示此幫助信息

範例:
  node create-article-script.js article.json
  node create-article-script.js --verbose blog/article.json
  node create-article-script.js -v ./data/my-article.json
`);
}

/**
 * 驗證並讀取 JSON 文件
 * @param {string} filePath 文件路徑
 * @returns {Object} 解析後的 JSON 數據
 */
function loadArticleData(filePath) {
  // 檢查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  // 檢查文件擴展名
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.json') {
    throw new Error(`文件必須是 JSON 格式: ${filePath}`);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const articleData = JSON.parse(data);

    // 基本驗證
    if (!articleData.title) {
      throw new Error('JSON 文件缺少必要的 "title" 字段');
    }

    if (!articleData.articleId) {
      throw new Error('JSON 文件缺少必要的 "articleId" 字段');
    }

    return articleData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`JSON 格式錯誤: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 顯示文章信息
 * @param {Object} articleData 文章數據
 * @param {Object} options 選項
 */
function displayArticleInfo(articleData, options) {
  console.log('📄 文章信息:');
  console.log(`   標題: ${articleData.title}`);
  console.log(`   ID: ${articleData.articleId}`);

  if (options.verbose) {
    console.log(`   狀態: ${articleData.status || '未設定'}`);
    console.log(`   類型: ${articleData.type || '未設定'}`);
    if (articleData.tags && articleData.tags.length > 0) {
      console.log(`   標籤: ${articleData.tags.join(', ')}`);
    }
  }
}

/**
 * 處理文章創建結果
 * @param {Object} result 創建結果
 * @param {Object} options 選項
 */
function displayResult(result, options) {
  console.log('\n✅ 文章建立成功!');

  if (result.createArticle && result.createArticle.data) {
    const article = result.createArticle.data;
    console.log(`📝 文章 ID: ${article.id}`);

    if (options.verbose && article.attributes) {
      console.log('\n📊 文章屬性:');
      console.log(JSON.stringify(article.attributes, null, 2));
    }
  }
}

/**
 * 主函數
 */
async function main() {
  try {
    // 解析命令行參數
    const { jsonFilePath, options } = parseArguments();

    console.log('🚀 開始建立文章...\n');

    // 讀取和驗證 JSON 數據
    const articleData = loadArticleData(jsonFilePath);

    // 顯示文章信息
    displayArticleInfo(articleData, options);

    // 創建文章
    console.log('\n⚙️ 正在創建文章...');
    const result = await createArticle(articleData);

    // 顯示結果
    displayResult(result, options);

  } catch (error) {
    console.error('\n❌ 建立文章失敗:', error.message);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main().catch(error => {
    console.error('未預期的錯誤:', error);
    process.exit(1);
  });
}

module.exports = { loadArticleData, displayArticleInfo, displayResult };