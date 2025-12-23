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
- [快速開始](notion-to-strapi/QUICK_START.md) - 30 秒快速上手指南
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

## 如何使用

這些技能已整合到專案中，可以直接在 Cursor 中使用。

## 開發新技能

需要開發新技能時，請遵循以下步驟：

1. **建立技能資料夾**：`content-pipeline/skills/your-skill-name`
2. **建立 SKILL.md**：技能的主要說明文件
3. **建立其他文件**：README.md、workflow.md、examples.md（可選）

## 技能規範

- 使用 Markdown 格式
- 技能資料夾使用 kebab-case 命名
- 檔案名稱使用大寫開頭
- 包含完整的說明和範例

## 相關資源

- [BLOG_PRD 規格書](../docs/FORMAT_NOTE_TO_BLOG_PRD.md)
