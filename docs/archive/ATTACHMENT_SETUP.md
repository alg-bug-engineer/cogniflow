# 附件功能实现 - 安装依赖

## 需要安装的依赖

### 服务端依赖（在项目根目录执行）

```bash
# 文件上传处理
pnpm add multer @types/multer

# PDF文本提取（可选，用于PDF文档分析）
pnpm add pdf-parse @types/pdf-parse

# 图片处理（可选，用于生成缩略图）
pnpm add sharp

# 文档处理（可选）
pnpm add mammoth  # 用于 .docx 文件
```

## 安装命令

```bash
cd /Users/zhangqilai/project/vibe-code-100-projects/cogniflow
pnpm add multer @types/multer sharp
```

## 环境配置

1. 复制 `server/.env.example` 到 `server/.env`
2. 配置智谱 AI API Key:
   ```
   ZHIPU_API_KEY=your-zhipu-api-key-here
   ```

## 数据库迁移

```bash
# 应用附件功能迁移
cd database
psql -U postgres -d cogniflow -f migrations/007_attachments_support.sql
```

或使用部署脚本（会重新部署整个数据库）:
```bash
cd database
./deploy-database.sh
```

## 创建上传目录

服务会自动创建，但也可以手动创建：

```bash
mkdir -p uploads/images
mkdir -p uploads/documents
mkdir -p uploads/videos
mkdir -p uploads/audios
mkdir -p uploads/others
mkdir -p uploads/thumbnails
```

## 测试API

### 1. 上传文件
```bash
curl -X POST http://localhost:3001/api/attachments/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/image.png"
```

### 2. 获取附件信息
```bash
curl http://localhost:3001/api/attachments/{attachment_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. 下载文件
```bash
curl http://localhost:3001/api/attachments/{attachment_id}/file \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -O
```

## 智谱 AI API Key 获取

1. 访问 https://open.bigmodel.cn/
2. 注册/登录账号
3. 在控制台创建 API Key
4. 将 API Key 添加到 `.env` 文件

## 注意事项

1. **文件大小限制**：默认 10MB，可在代码中调整
2. **支持的文件类型**：
   - 图片：PNG, JPEG, JPG, GIF, WebP
   - 文档：PDF, TXT, Markdown, DOCX, DOC
3. **存储路径**：默认 `./uploads`，可在配置中修改
4. **AI分析**：图片和文档会自动进行AI分析（异步处理）
