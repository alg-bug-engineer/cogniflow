# 附件上传功能 - 快速启动指南

## 问题修复完成 ✅

### 1. 后端路由类型错误 ✅
已修复 `/server/routes/attachments.ts` 中的所有 TypeScript 类型错误：
- 正确导入 `AuthRequest` 类型
- 添加 `Response` 和 `NextFunction` 类型
- 修复 `multer` 文件过滤器的类型定义
- 所有路由处理器正确使用 `AuthRequest` 类型

### 2. 前端上传按钮 ✅
在 `QuickInput` 组件中添加了附件上传功能：
- ✅ 输入框左侧的附件按钮（📎图标）
- ✅ 文件选择和预览功能
- ✅ 支持多文件上传
- ✅ 文件类型和大小验证
- ✅ 上传进度显示
- ✅ 与文本输入结合使用

## 快速测试步骤

### 1. 配置环境

```bash
# 1. 配置后端环境变量
cd server
cp .env.example .env

# 编辑 .env 文件，添加智谱 AI API Key
# ZHIPU_API_KEY=your-api-key-here
```

### 2. 应用数据库迁移

```bash
# 方式一：单独应用附件迁移
cd database
psql -U postgres -d cogniflow -f migrations/007_attachments_support.sql

# 方式二：重新部署整个数据库（推荐）
./deploy-database.sh
```

### 3. 启动服务

```bash
# 启动后端
cd server
pnpm dev

# 启动前端（新终端）
cd ..
pnpm dev:postgres
```

### 4. 测试上传功能

1. 打开浏览器访问 http://127.0.0.1:5173
2. 登录系统
3. 在底部输入框左侧找到📎按钮
4. 点击按钮选择文件：
   - 支持图片：PNG, JPEG, GIF, WebP
   - 支持文档：PDF, TXT, Markdown, DOCX, DOC
5. 选择文件后会显示预览
6. 可以输入文本描述（可选）
7. 点击发送按钮上传
8. 等待AI分析完成

## 功能特性

### 支持的操作

1. **文件上传**
   - 点击📎按钮选择文件
   - 支持多文件选择
   - 实时显示文件列表
   - 可以移除已选文件

2. **文件验证**
   - 自动检查文件类型
   - 限制文件大小（10MB）
   - 不支持的文件会提示错误

3. **AI分析**
   - 图片自动识别内容
   - 文档自动提取关键信息
   - 生成标签和描述
   - 识别任务和事件

4. **附件管理**
   - 在卡片中查看附件
   - 下载附件文件
   - 删除不需要的附件

## 界面说明

### QuickInput 布局

```
┌────────────────────────────────────────────────────────┐
│  📎  │  [已选文件列表]                                 │
│      │  ┌──────────────────────────────┐  │ 📤发送 │  │
│      │  │                              │  │        │  │
│      │  │    输入框                     │  │        │  │
│      │  │                              │  │        │  │
│      │  └──────────────────────────────┘  │        │  │
└────────────────────────────────────────────────────────┘
```

### 文件预览显示

```
┌────────────────────────────────────┐
│  [文件1.png] ✖                     │
│  [文件2.pdf] ✖                     │
└────────────────────────────────────┘
```

## API 端点

### 后端API
- `POST /api/attachments/upload` - 上传文件
- `GET /api/attachments/:id` - 获取附件信息
- `GET /api/attachments/:id/file` - 下载文件
- `GET /api/attachments/item/:itemId` - 获取条目附件
- `DELETE /api/attachments/:id` - 删除附件
- `GET /api/attachments/stats/user` - 用户统计

## 代码改动摘要

### 后端文件
1. `/server/routes/attachments.ts` - 修复所有类型错误
2. `/server/services/attachmentService.ts` - 附件服务（已创建）
3. `/server/services/aiVisionService.ts` - AI视觉服务（已创建）
4. `/server/index.ts` - 注册附件路由（已更新）

### 前端文件
1. `/src/components/items/QuickInput.tsx` - 添加上传按钮和逻辑
2. `/src/utils/attachmentUtils.ts` - 附件工具函数（已创建）
3. `/src/components/attachments/AttachmentUploader.tsx` - 上传组件（已创建）
4. `/src/components/attachments/AttachmentList.tsx` - 列表组件（已创建）

### 数据库
1. `/database/migrations/007_attachments_support.sql` - 附件表结构
2. `/database/deploy.sql` - 包含附件表的完整部署脚本

## 测试清单

- [ ] 可以看到附件按钮（📎）
- [ ] 点击按钮可以选择文件
- [ ] 选择文件后显示文件名
- [ ] 可以移除已选文件
- [ ] 上传时显示加载状态
- [ ] 上传成功后显示提示
- [ ] AI分析完成后可以看到标签和描述
- [ ] 可以下载已上传的附件
- [ ] 可以删除不需要的附件

## 常见问题

### Q: 看不到附件按钮？
A: 确保前端代码已更新，刷新浏览器页面。

### Q: 上传失败？
A: 检查：
1. 后端服务是否运行（端口3001）
2. 数据库迁移是否应用
3. uploads目录是否有写权限
4. 文件类型和大小是否符合要求

### Q: AI分析不工作？
A: 检查：
1. `ZHIPU_API_KEY` 是否配置正确
2. 网络是否可以访问智谱AI服务
3. 查看后端日志的错误信息

### Q: 文件保存在哪里？
A: 默认保存在 `server/uploads/` 目录下，按文件类型分类存储。

## 下一步

现在附件上传功能已经可以使用了！你可以：

1. **测试基本功能**
   - 上传各种类型的文件
   - 查看AI分析结果
   - 测试下载和删除

2. **集成到其他组件**
   - 在 ItemCard 中显示附件
   - 在编辑对话框中管理附件
   - 在报告中统计附件使用

3. **优化用户体验**
   - 添加拖拽上传
   - 图片压缩
   - 批量操作

4. **扩展功能**
   - 支持更多文件类型
   - 云存储集成
   - 附件分享

## 技术支持

如有问题，请查看：
- `/docs/ATTACHMENT_FEATURE.md` - 详细功能文档
- `/docs/ATTACHMENT_SETUP.md` - 安装配置指南
- 后端日志：查看 server 目录的控制台输出
- 前端日志：打开浏览器开发者工具查看 Console
