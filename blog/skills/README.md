# Blog Skills 目錄

這個目錄包含用於部落格內容管理的 Claude Skills。

## 可用技能

### 1. Notion 到 Strapi 轉換技能

**路徑**：`notion-to-strapi/`

**功能**：將 Notion 頁面中的文章內容自動轉換為 Strapi CMS 中的部落格文章。

**快速開始**：
```
請幫我將這個 Notion 文章轉換為 Strapi 文章：
https://www.notion.so/penguin-cho/文章標題-xxx
```

**文件**：
- [技能說明](notion-to-strapi/SKILL.md) - 技能的主要說明文件
- [使用教學](notion-to-strapi/README.md) - 詳細的使用教學和常見問題
- [工作流程](notion-to-strapi/workflow.md) - 完整的流程圖和技術細節
- [使用範例](notion-to-strapi/examples.md) - 各種使用情境的範例

## 技能結構

每個技能都遵循 Claude Skills 的標準格式：

```
skill-name/
├── SKILL.md          # 技能的主要說明文件（必需）
├── README.md         # 使用教學文件
├── workflow.md       # 工作流程說明
└── examples.md       # 使用範例
```

## 如何安裝技能

### 在 Claude Code 中使用

1. 將技能資料夾複製到 `~/.claude/skills/` 目錄
2. 或在 Claude Code 中透過插件市場安裝

### 在 Claude API 中使用

在 API 請求中包含技能路徑：

```javascript
{
  "model": "claude-3-5-sonnet-20241022",
  "skills": [
    {
      "path": "./blog/skills/notion-to-strapi"
    }
  ]
}
```

## 開發新技能

要開發新的技能，請遵循以下步驟：

1. **建立技能資料夾**
   ```bash
   mkdir blog/skills/your-skill-name
   ```

2. **建立 SKILL.md**
   - 這是技能的必需文件
   - 說明技能的功能、使用方式和前置需求

3. **建立其他文件**（可選）
   - README.md：詳細的使用教學
   - workflow.md：工作流程說明
   - examples.md：使用範例

4. **測試技能**
   - 在 Claude 中測試技能是否正常運作
   - 確認所有文件都清楚易懂

## 技能開發規範

### 文件格式

- 使用 Markdown 格式
- 保持文件結構清晰
- 包含足夠的範例和說明

### 命名規範

- 技能資料夾使用 kebab-case
- 檔案名稱使用大寫開頭（如 SKILL.md, README.md）

### 內容要求

- **SKILL.md**：必須包含
  - 技能概述
  - 功能說明
  - 使用情境
  - 前置需求
  - 基本使用方式

- **README.md**：建議包含
  - 快速開始指南
  - 詳細使用說明
  - 常見問題
  - 技術支援資訊

## 貢獻指南

如果你想要貢獻新的技能或改進現有技能：

1. 確保技能符合 Claude Skills 格式
2. 提供完整的文件
3. 包含使用範例
4. 測試技能功能

## 相關資源

- [Claude Skills 官方文件](https://claude.com/blog/skills)
- [Claude Skills GitHub 範例](https://github.com/anthropics/skills)
- [BLOG_PRD 規格書](../docs/BLOG_PRD.md)
