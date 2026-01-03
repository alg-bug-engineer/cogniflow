# CogniFlow 部署指南

## 🚀 唯一部署方式

CogniFlow 提供**唯一且完整的一键部署脚本**，无需任何迁移操作。

```bash
./deploy-all.sh
```

## ⚠️ 重要说明

- **此脚本会清空所有现有数据**
- 包含最新的所有功能（包括 API 使用次数限制、附件支持等）
- 适用于新部署和重新部署
- 不需要单独的迁移脚本

## 📋 部署流程

### 1. 确认环境

确保已安装以下工具：
- Docker
- Docker Compose
- Node.js (v18+)
- pnpm

### 2. 执行部署

```bash
# 进入项目根目录
cd /path/to/cogniflow

# 执行一键部署
./deploy-all.sh
```

### 3. 确认操作

脚本会要求你确认：
```
警告: 此操作将删除所有现有数据！

确认继续部署? (输入 yes 继续):
```

输入 `yes` 继续。

### 4. 等待完成

脚本会自动执行以下操作：
1. ✅ 停止并删除旧容器和数据卷
2. ✅ 启动新的 PostgreSQL 容器
3. ✅ 初始化数据库和所有表（包含所有最新功能）
4. ✅ 安装项目依赖
5. ✅ 配置环境变量
6. ✅ 显示部署信息

## 🎯 部署后操作

### 启动服务

**方式一：同时启动前后端（推荐）**
```bash
pnpm run dev:postgres
```

**方式二：分别启动**
```bash
# 终端1：启动后端
cd server && pnpm run dev

# 终端2：启动前端
pnpm run dev
```

### 验证部署

```bash
./database/verify-deployment-docker.sh
```

### 访问应用

- 前端：http://127.0.0.1:5173
- 后端：http://localhost:3001
- pgAdmin：http://localhost:5050

### 默认管理员账号

- 用户名：`admin`
- 密码：`admin123`
- ⚠️ **请登录后立即修改密码！**

## 📊 包含的功能

部署脚本会自动创建以下所有功能：

### 核心功能
- ✅ 用户认证系统
- ✅ 智能卡片记录
- ✅ 日程管理
- ✅ 标签系统
- ✅ 智能模板
- ✅ 附件支持
- ✅ 冲突检测
- ✅ 语音输入
- ✅ API 使用限制管理

## 🔧 常用命令

### Docker 相关

```bash
# 查看容器日志
docker logs -f cogniflow-postgres

# 进入数据库
docker exec -it cogniflow-postgres psql -U cogniflow_user -d cogniflow

# 停止容器
docker-compose down

# 重启容器
docker-compose restart

# 查看所有表
docker exec cogniflow-postgres psql -U cogniflow_user -d cogniflow -c '\dt'
```

### 数据库管理

```bash
# 查看用户使用情况
docker exec cogniflow-postgres psql -U cogniflow_user -d cogniflow -c "
SELECT
  username,
  account_type,
  api_usage_count as used,
  max_api_usage as max,
  (max_api_usage - api_usage_count) as remaining
FROM users
ORDER BY api_usage_count DESC;
"

# 重置所有用户使用次数
docker exec cogniflow-postgres psql -U cogniflow_user -d cogniflow -c "
UPDATE users SET api_usage_count = 0, usage_reset_at = CURRENT_TIMESTAMP;
"
```

## ❓ 常见问题

### Q: 已有数据怎么办？

A: `deploy-all.sh` 会删除所有现有数据。如需保留数据，请先备份：

```bash
# 备份数据库
docker exec cogniflow-postgres pg_dump -U cogniflow_user cogniflow > backup.sql

# 部署后恢复
docker exec -i cogniflow-postgres psql -U cogniflow_user -d cogniflow < backup.sql
```

### Q: 部署失败怎么办？

A: 检查以下几点：
1. Docker 是否正常运行
2. 端口 5432、5050、3001、5173 是否被占用
3. 查看错误日志
4. 清理残留容器后重试

```bash
# 清理所有容器和卷
docker-compose down -v

# 重新部署
./deploy-all.sh
```

### Q: 如何更新到最新版本？

A: 拉取最新代码后重新运行部署脚本：

```bash
git pull
./deploy-all.sh
```

### Q: 是否需要迁移脚本？

A: **不需要**。`deploy-all.sh` 包含所有最新功能，直接使用即可。每次部署都是完整的全新部署。

## 🎯 最佳实践

### 开发环境

1. 使用 `deploy-all.sh` 进行初始部署
2. 日常开发使用 `pnpm run dev:postgres` 启动服务
3. 需要重置数据时再次运行 `deploy-all.sh`

### 生产环境

1. **必须**修改默认密码
2. 配置正确的环境变量
3. 设置定期备份
4. 配置日志监控

### 数据备份

建议定期备份：

```bash
# 创建备份目录
mkdir -p backups

# 定期备份脚本
docker exec cogniflow-postgres pg_dump -U cogniflow_user cogniflow > "backups/backup_$(date +%Y%m%d_%H%M%S).sql"
```

## 🔒 生产环境检查清单

### 安全配置
- [ ] 修改默认管理员密码
- [ ] 配置 HTTPS
- [ ] 设置防火墙规则
- [ ] 配置环境变量保护
- [ ] 启用日志监控

### API配置
- [ ] 配置智谱AI API Key
- [ ] 验证API功能正常
- [ ] 设置API使用限制
- [ ] 配置个人API Key功能

### 数据库配置
- [ ] 设置数据库密码
- [ ] 配置定期备份
- [ ] 验证RLS策略
- [ ] 检查数据库性能

### 功能验证
- [ ] 用户注册登录正常
- [ ] 智能输入功能正常
- [ ] AI处理返回正确结果
- [ ] 附件上传功能正常
- [ ] 所有视图显示正常
- [ ] 搜索功能正常
- [ ] 管理面板正常

## 📚 相关文档

- [数据库部署指南](./DATABASE_DEPLOYMENT_GUIDE.md)
- [安全指南](./SECURITY_GUIDE.md)
- [文件存储配置](./FILE_STORAGE_CONFIG.md)
- [阿里云部署指南](./ALIYUN_ECS_DEPLOYMENT.md)

---

**部署遇到问题？** 请查看日志或提交 Issue。

**祝部署顺利！** 🎉
