# 附件功能配置指南

## 环境变量配置

### 必需配置

编辑 `server/.env` 文件：

```bash
# 智谱AI API Key（必需 - 用于AI分析）
ZHIPU_API_KEY=your_api_key_here
```

获取 API Key：
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制到配置文件

### 可选配置

```bash
# 最大文件大小（字节，默认10MB）
MAX_FILE_SIZE=10485760

# 上传目录（相对路径或绝对路径）
UPLOAD_DIR=./uploads

# 允许的文件类型（逗号分隔）
ALLOWED_FILE_TYPES=image/png,image/jpeg,image/gif,image/webp,application/pdf,text/plain

# 缩略图宽度（像素）
THUMBNAIL_WIDTH=300

# 缩略图质量（1-100）
THUMBNAIL_QUALITY=80
```

## 数据库配置

### 自动配置

运行部署脚本会自动创建附件相关表：

```bash
./deploy-all.sh
```

### 手动配置

如需手动配置，执行以下SQL：

```bash
psql -U cogniflow_user -d cogniflow -f database/migrations/007_attachments_support.sql
```

### 表结构说明

1. **attachments** - 附件信息表
2. **attachment_configs** - 附件配置表
3. **user_attachment_stats** - 用户统计视图

## 存储配置

### 本地存储（默认）

附件存储在服务器本地文件系统：

```
uploads/
├── images/        # 图片文件
├── documents/     # 文档文件
├── videos/        # 视频文件
├── audios/        # 音频文件
├── others/        # 其他文件
└── thumbnails/    # 缩略图
```

### 云存储配置

如需使用云存储（阿里云OSS、AWS S3等），需要：

1. 安装对应的SDK
2. 修改 `server/services/attachmentService.ts`
3. 配置云存储认证信息

详见 [部署指南 - 文件存储配置](../deployment/FILE_STORAGE_CONFIG.md)

## 权限配置

### 文件系统权限

确保上传目录有正确的权限：

```bash
# 创建上传目录
mkdir -p uploads/{images,documents,videos,audios,others,thumbnails}

# 设置权限
chmod 755 uploads
chmod 755 uploads/*
chown -R your_user:your_group uploads
```

### 数据库权限

确保数据库用户有创建表的权限：

```sql
GRANT ALL PRIVILEGES ON DATABASE cogniflow TO cogniflow_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cogniflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cogniflow_user;
```

## 性能优化配置

### 并发上传限制

在 `server/routes/attachments.ts` 中配置：

```typescript
const MAX_CONCURRENT_UPLOADS = 3; // 最大并发上传数
```

### AI分析队列

如果AI分析请求较多，可以配置队列：

```bash
# AI分析并发数
AI_ANALYSIS_CONCURRENCY=5

# AI分析超时时间（毫秒）
AI_ANALYSIS_TIMEOUT=30000
```

### 缓存配置

为附件API响应添加缓存：

```typescript
// 缓存时间（秒）
const ATTACHMENT_CACHE_TTL = 3600;
```

## 安全配置

### 文件类型验证

严格限制允许的文件类型：

```typescript
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
```

### 文件大小限制

根据业务需求调整大小限制：

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### 扫描病毒（可选）

集成病毒扫描工具：

```bash
# 安装 ClamAV
sudo apt-get install clamav clamav-daemon

# 在服务中集成扫描
```

## 监控配置

### 日志记录

启用附件上传日志：

```typescript
// 在 server/services/attachmentService.ts 中
console.log('[Attachment] Upload:', {
  userId,
  fileName,
  fileSize,
  mimeType,
  timestamp: new Date().toISOString()
});
```

### 统计监控

定期检查用户附件使用情况：

```sql
-- 查看附件使用统计
SELECT * FROM user_attachment_stats
WHERE user_id = 'your_user_id';
```

## 测试配置

### 本地测试

1. 启动开发服务器：
   ```bash
   cd server
   pnpm dev
   ```

2. 访问 http://localhost:3001

3. 测试上传功能

### 单元测试

运行附件相关测试：

```bash
pnpm test attachments
```

## 故障排查

### 问题1：上传目录权限错误

**错误信息**：`EACCES: permission denied`

**解决方案**：
```bash
sudo chmod -R 755 uploads/
sudo chown -R $USER:$USER uploads/
```

### 问题2：AI分析失败

**错误信息**：`AI analysis failed`

**解决方案**：
1. 检查 API Key 是否正确
2. 确认智谱AI账户余额
3. 查看服务器日志

### 问题3：文件类型不支持

**错误信息**：`File type not allowed`

**解决方案**：
1. 检查 `ALLOWED_FILE_TYPES` 配置
2. 确认文件MIME类型
3. 如需支持新类型，更新配置

### 问题4：数据库连接失败

**解决方案**：
```bash
# 检查PostgreSQL状态
docker ps | grep postgres

# 查看数据库日志
docker logs cogniflow-postgres

# 测试连接
psql -U cogniflow_user -d cogniflow -c "SELECT 1"
```

## 升级配置

### 从旧版本升级

如果从旧版本升级附件功能：

1. 备份数据
2. 运行迁移脚本
3. 更新配置文件
4. 重启服务

```bash
# 备份
pg_dump -U cogniflow_user cogniflow > backup.sql

# 迁移
psql -U cogniflow_user -d cogniflow -f database/migrations/007_attachments_support.sql

# 重启
docker-compose restart server
```

## 最佳实践

1. **定期清理**：定期清理未使用的附件文件
2. **监控存储**：监控存储空间使用情况
3. **备份重要文件**：定期备份用户上传的文件
4. **限制大小**：根据服务器配置合理设置文件大小限制
5. **HTTPS**：生产环境使用HTTPS保护传输安全

## 相关文档

- [附件功能说明](../features/ATTACHMENTS.md)
- [附件快速开始](../quickstart/ATTACHMENT_IMAGE_QUICKSTART.md)
- [部署指南](../deployment/DEPLOYMENT_GUIDE.md)
