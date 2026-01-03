# 附件功能文档

## 功能概述

CogniFlow 支持附件上传功能，允许用户上传图片、文档等多种格式的文件，并通过智谱AI进行内容分析。

## 支持的文件类型

### 图片格式
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- WebP (.webp)

### 文档格式
- PDF (.pdf)
- 纯文本 (.txt)
- Markdown (.md)
- Word文档 (.docx, .doc)

### 文件大小限制
- 默认：10MB
- 可在配置中调整

## 主要功能

### 1. 附件上传
- **批量上传**：支持同时选择多个文件
- **实时预览**：上传前预览文件信息
- **进度显示**：显示上传进度
- **拖拽上传**：支持拖拽文件上传

### 2. AI 智能分析

#### 图片分析
使用智谱GLM-4V视觉模型分析图片内容：
- 场景描述
- 关键信息提取
- 自动生成标签
- 建议的标题和类型
- 识别任务、事件等内容

#### 文档分析
使用智谱GLM-4模型分析文档：
- 内容摘要
- 关键信息提取
- 标签生成
- 任务和事件识别

### 3. 附件管理
- **查看附件**：在ItemCard中查看附件列表
- **图片预览**：显示缩略图预览
- **文档图标**：显示对应文件类型图标
- **下载功能**：点击下载按钮获取文件
- **删除功能**：点击删除按钮移除附件
- **使用统计**：查看附件使用统计

## 配置说明

### 环境变量配置

在 `server/.env` 中配置以下变量：

```bash
# 智谱AI API Key（必需）
ZHIPU_API_KEY=your_api_key_here

# 最大文件大小（可选，默认10MB）
MAX_FILE_SIZE=10485760

# 上传目录（可选）
UPLOAD_DIR=./uploads
```

### 数据库配置

附件功能需要以下数据库表：
- **attachments**：存储附件信息
- **attachment_configs**：存储附件配置
- **user_attachment_stats**：用户附件统计视图

部署时会自动创建这些表。

## 使用方法

### 上传附件

1. 在QuickInput中点击附件按钮（📎）
2. 选择文件（支持多选）
3. 预览文件信息
4. 点击"上传全部"或自动上传
5. AI自动分析文件内容

### 查看附件

- 在ItemCard中查看附件列表
- 图片显示缩略图预览
- 文档显示文件图标
- 显示AI分析的描述和标签

### API 接口

#### 上传附件
```http
POST /api/attachments/upload
Content-Type: multipart/form-data

响应:
{
  "success": true,
  "attachment": {
    "id": "uuid",
    "fileName": "example.jpg",
    "fileSize": 12345,
    "mimeType": "image/jpeg",
    "aiAnalysis": { ... }
  }
}
```

#### 获取附件列表
```http
GET /api/attachments/item/:itemId

响应:
{
  "attachments": [
    {
      "id": "uuid",
      "fileName": "example.jpg",
      "aiDescription": "描述文本",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

#### 删除附件
```http
DELETE /api/attachments/:id

响应:
{
  "success": true,
  "message": "附件已删除"
}
```

## 安全考虑

1. **文件类型验证**：只允许特定类型的文件
2. **文件大小限制**：防止上传过大文件
3. **用户认证**：所有API都需要认证
4. **文件隔离**：每个用户的文件独立存储
5. **路径安全**：防止路径遍历攻击

## 性能优化

1. **异步AI分析**：上传完成立即返回，AI分析在后台进行
2. **缩略图生成**：为图片自动生成缩略图
3. **懒加载**：附件列表按需加载
4. **文件流式下载**：大文件使用流式下载

## 常见问题

### Q: 上传失败怎么办？
A: 检查以下几点：
1. 文件类型是否支持
2. 文件大小是否超限（默认10MB）
3. 网络连接是否正常
4. 智谱AI API Key是否配置正确

### Q: AI分析需要多长时间？
A: 通常在几秒到十几秒，取决于文件大小和复杂度。分析是异步进行的，不会阻塞上传。

### Q: 如何配置存储路径？
A: 在 `server/.env` 中设置 `UPLOAD_DIR` 变量，或在数据库的 `attachment_configs` 表中修改。

### Q: 支持哪些AI模型？
A: 当前使用智谱AI的GLM-4V（视觉）和GLM-4（文本）模型。

### Q: 可以在本地模式使用附件功能吗？
A: 可以，但AI分析功能需要配置智谱AI API Key。本地IndexedDB模式不支持文件存储。

## 未来增强

### 短期计划
- 图片自动压缩和优化
- 支持更多文档格式（Excel、PPT等）
- 附件搜索功能
- 批量下载

### 中期计划
- 云存储集成（OSS、S3等）
- 附件版本管理
- 附件分享功能
- OCR文字识别

### 长期计划
- 视频转录和分析
- 音频转文字
- 智能相册功能
- 协作编辑

## 版本信息

- **功能版本**: v1.3.0
- **数据库迁移**: 007_attachments_support.sql
- **实施日期**: 2025-11-04
- **兼容性**: 向后兼容，不影响现有功能

## 相关文档

- [附件快速开始](../quickstart/ATTACHMENT_IMAGE_QUICKSTART.md)
- [附件配置指南](../configuration/ATTACHMENT_CONFIG.md)
- [附件显示优化](./ATTACHMENT_IMAGE_DISPLAY.md)
