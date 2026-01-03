# 附件图片显示调试指南

## 问题描述
前端卡片没有显示附件图片，但API正在被频繁调用。

## 已添加的调试日志

### 前端日志（浏览器控制台）

1. **附件加载日志**
```
[AttachmentImages] Item {itemId}: 获取到 X 个附件
[AttachmentImages] Item {itemId}: 其中 X 个是图片
```

2. **渲染状态日志**
```
[AttachmentImages] Item {itemId}: 没有图片附件，不渲染组件
[AttachmentImages] Item {itemId}: 渲染 X 张图片
```

3. **图片URL日志**
```
[AttachmentImages] 渲染图片 1: { id, filename, url }
```

4. **图片加载日志**
```
[AttachmentImages] 图片加载成功: {attachmentId}
[AttachmentImages] 图片加载失败: {attachmentId}
```

### 后端日志（终端）

1. **API请求日志**
```
[Attachments API] 获取条目 {itemId} 的附件列表
[Attachments API] 条目 {itemId} 有 X 个附件
[Attachments API] 附件类型: [...]
```

## 调试步骤

### 第1步：检查是否有附件数据

打开浏览器控制台（F12），刷新页面，查看日志：

```
[AttachmentImages] Item xxx: 获取到 0 个附件
```

**如果是0个附件**：
- 该笔记/待办还没有上传附件
- 需要先上传图片附件

### 第2步：检查附件类型

如果有附件但不显示，检查：

```
[AttachmentImages] Item xxx: 获取到 2 个附件
[AttachmentImages] Item xxx: 其中 0 个是图片
```

**如果图片数量为0**：
- 附件可能不是图片类型（PDF、文档等）
- 检查数据库中 `file_type` 字段是否正确

### 第3步：检查图片URL

如果有图片但不显示，查看URL：

```
[AttachmentImages] 渲染图片 1: {
  id: "xxx",
  filename: "image.jpg",
  url: "http://localhost:3001/api/attachments/xxx/file?token=..."
}
```

**手动测试URL**：
1. 复制日志中的URL
2. 在新标签页中打开
3. 如果无法访问，可能是认证问题

### 第4步：检查图片加载状态

查看是加载成功还是失败：

```
[AttachmentImages] 图片加载成功: xxx
或
[AttachmentImages] 图片加载失败: xxx
```

**如果加载失败**：
- 检查文件是否存在于 `uploads/` 目录
- 检查文件路径是否正确
- 检查文件权限

## 常见问题及解决方案

### 问题1：API返回空数组

**原因**：该条目没有附件

**解决**：
```bash
# 检查数据库
psql -U postgres -d cogniflow
SELECT * FROM attachments WHERE item_id = 'xxx';
```

### 问题2：附件类型不是image

**原因**：file_type 字段值不正确

**解决**：
```sql
-- 检查附件类型
SELECT id, original_filename, mime_type, file_type 
FROM attachments 
WHERE item_id = 'xxx';

-- 如果类型错误，手动修正
UPDATE attachments 
SET file_type = 'image' 
WHERE mime_type LIKE 'image/%';
```

### 问题3：图片URL无法访问

**原因**：认证token问题或文件不存在

**解决**：
1. 检查 localStorage 中的 token
2. 检查文件是否存在：
```bash
ls -la uploads/images/
```

### 问题4：图片加载失败

**原因**：CORS、路径或权限问题

**解决**：
1. 检查后端CORS配置
2. 检查文件权限：
```bash
chmod 644 uploads/images/*
```

## 测试方案

### 方案A：使用测试数据

1. 创建一条新笔记：
```
美女
```

2. 编辑该笔记，上传一张图片

3. 返回列表页查看是否显示

### 方案B：检查现有数据

1. 打开浏览器控制台
2. 切换到"我的笔记"标签
3. 查看日志输出
4. 根据日志判断问题

### 方案C：直接测试API

```bash
# 获取所有附件
curl http://localhost:3001/api/attachments/item/{itemId} \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试图片文件
curl http://localhost:3001/api/attachments/{attachmentId}/file?token=YOUR_TOKEN \
  --output test.jpg
```

## 预期行为

### 正常流程：

1. 页面加载时，每个卡片调用一次 `/api/attachments/item/{itemId}`
2. 如果有图片附件，组件渲染图片网格
3. 图片开始加载，显示加载动画
4. 图片加载完成，显示实际图片
5. 悬浮时显示放大效果

### 控制台日志：

```
[API] 📥 GET /api/attachments/item/xxx
[Attachments API] 获取条目 xxx 的附件列表
[Attachments API] 条目 xxx 有 1 个附件
[Attachments API] 附件类型: [{ id, filename, type: 'image', mime: 'image/jpeg' }]
[AttachmentImages] Item xxx: 获取到 1 个附件
[AttachmentImages] Item xxx: 其中 1 个是图片
[AttachmentImages] Item xxx: 渲染 1 张图片
[AttachmentImages] 渲染图片 1: { id, filename, url }
[AttachmentImages] 图片加载成功: xxx
```

## 下一步

1. **刷新页面**，查看控制台日志
2. **记录所有日志**，特别关注：
   - 获取到几个附件？
   - 其中几个是图片？
   - 图片URL是什么？
   - 加载成功还是失败？
3. **根据日志定位问题**
4. **如果还有问题，提供完整的日志输出**

## 快速检查清单

- [ ] 后端服务正常运行（pnpm dev:postgres）
- [ ] 数据库中有附件记录
- [ ] 附件 file_type 字段为 'image'
- [ ] 文件存在于 uploads/ 目录
- [ ] 浏览器控制台没有CORS错误
- [ ] 可以看到调试日志输出
- [ ] 图片URL可以手动访问

## 联系信息

如果以上步骤都无法解决，请提供：
1. 完整的浏览器控制台日志
2. 后端终端日志
3. 数据库附件记录截图
4. 网络请求详情（Network标签）
