# API 使用优化功能说明

## 📋 功能概述

本次更新实现了用户个人 API Key 配置功能，允许用户使用自己的智谱 AI API Key，避免受到系统默认配额限制。

## ✨ 主要功能

### 1. 用户 API 使用限制
- **注册用户**: 默认可使用 100 次 AI 功能
- **快速登录用户**: 默认可使用 50 次 AI 功能
- **配置个人 API Key**: 不受次数限制

### 2. 注册时配置 API Key
- 在注册页面新增"智谱 AI API Key"输入框（可选）
- 用户可在注册时直接配置个人 API Key
- 如果不配置，使用系统默认 API，受到次数限制

### 3. 个人资料页面管理
- 显示当前 API 使用情况和配额
- 可以配置、更新或删除个人 API Key
- 实时显示剩余调用次数或无限制状态

### 4. API 调用优先级
- 系统优先使用用户配置的个人 API Key
- 如果没有配置个人 API Key，使用系统默认 API
- 配置个人 API Key 后，不再受次数限制

## 🗄️ 数据库变更

### 新增字段
在 `users` 表中新增：
- `personal_api_key` (VARCHAR(500)): 用户个人的智谱 API Key

### 数据库函数更新
1. **check_and_increment_api_usage**: 检查并扣减 API 使用次数
   - 如果有个人 API Key，不限制使用次数
   - 如果没有，检查是否达到配额限制

2. **get_user_api_usage**: 获取用户 API 使用情况
   - 返回当前使用次数、最大限制
   - 返回是否配置了个人 API Key

## 🚀 部署步骤

### 1. 一键部署

```bash
# 运行完整部署脚本（v1.2.0，包含个人 API Key 功能）
./deploy-all.sh
```

**说明**: `deploy-all.sh` v1.2.0 已包含所有个人 API Key 功能，会自动：
- 部署数据库 schema（包含 personal_api_key 字段）
- 验证功能部署状态
- 显示 API 使用说明

### 2. 验证数据库更新

```bash
# 进入 PostgreSQL 容器
docker exec -it cogniflow-postgres psql -U cogniflow_user -d cogniflow

# 检查 users 表结构
\d users

# 应该看到 personal_api_key 字段

# 检查函数
\df check_and_increment_api_usage
\df get_user_api_usage
```

### 3. 重启服务

```bash
# 重启后端服务
docker-compose restart server

# 或者完全重启
docker-compose down
docker-compose up -d
```

## 📝 使用说明

### 用户注册
1. 访问注册页面
2. 填写必填信息（用户名、邮箱、密码）
3. **可选**：在"智谱 AI API Key"字段输入个人 API Key
4. 完成注册

### 配置个人 API Key
1. 登录后访问个人资料页面
2. 找到"API 配置"卡片
3. 查看当前使用情况
4. 输入智谱 AI API Key
5. 点击"保存 API Key"

### 获取智谱 API Key
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制 API Key 到 CogniFlow

### 删除个人 API Key
1. 访问个人资料页面
2. 在"API 配置"卡片中
3. 点击"删除 API Key"
4. 确认删除
5. 删除后将恢复使用系统默认配额

## 🔒 安全说明

1. **API Key 存储**: 
   - API Key 以明文形式存储在数据库中
   - 仅用户本人可以查看和修改
   - 建议在生产环境中使用加密存储

2. **访问控制**:
   - 用户只能访问自己的 API Key
   - 管理员无法查看用户的 API Key

3. **最佳实践**:
   - 定期更换 API Key
   - 不要分享 API Key
   - 发现泄露立即删除并重新生成

## 🎯 API 端点

### 获取 API 使用情况
```http
GET /api/users/api-usage
Authorization: Bearer <token>

响应:
{
  "current": 5,          // 当前使用次数
  "max": 100,            // 最大限制
  "remaining": 95,       // 剩余次数（有个人 API Key 时为 -1）
  "hasPersonalKey": false,  // 是否配置了个人 API Key
  "accountType": "registered",  // 账户类型
  "usageResetAt": null   // 使用次数重置时间
}
```

### 更新个人 API Key
```http
PUT /api/users/api-key
Authorization: Bearer <token>
Content-Type: application/json

{
  "personalApiKey": "your-api-key-here"
}

响应:
{
  "message": "API Key 更新成功"
}
```

### 删除个人 API Key
```http
DELETE /api/users/api-key
Authorization: Bearer <token>

响应:
{
  "message": "API Key 已删除"
}
```

### 检查并扣减 API 使用次数
```http
POST /api/users/api-usage/check
Authorization: Bearer <token>

响应（成功）:
{
  "success": true,
  "remaining": 99,
  "message": "使用次数已扣减"
}

响应（达到限制）:
{
  "success": false,
  "error": "已达到使用限制，请配置个人 API Key",
  "remaining": 0
}
```

## 🐛 故障排查

### 问题1: API Key 更新失败
**可能原因**: API Key 格式不正确
**解决方案**: 
- 确保 API Key 长度至少 20 个字符
- 检查是否包含特殊字符
- 从智谱 AI 平台重新复制 API Key

### 问题2: 仍然受到次数限制
**可能原因**: API Key 未正确保存
**解决方案**:
- 刷新页面重新检查配置状态
- 重新保存 API Key
- 查看浏览器控制台是否有错误信息

### 问题3: AI 功能无法使用
**可能原因**: 
- 达到使用限制且未配置个人 API Key
- 个人 API Key 无效或已过期
**解决方案**:
- 检查 API 使用情况
- 验证个人 API Key 是否有效
- 在智谱 AI 平台检查 API Key 状态

## 📊 监控和统计

### 管理员功能
管理员可以：
- 查看所有用户的 API 使用情况
- 重置用户的 API 使用次数
- 监控系统 API 使用统计

### 用户功能
用户可以：
- 查看自己的 API 使用情况
- 查看剩余次数
- 配置和管理个人 API Key

## 🎉 总结

本次更新实现了完整的 API 使用管理功能，包括：
✅ 数据库表结构更新（支持个人 API Key）
✅ 注册界面支持配置 API Key
✅ 个人资料页面 API 管理功能
✅ 服务端 API 调用优先级逻辑
✅ API 使用限制检查和提示
✅ 完整的 API 端点实现

用户现在可以选择使用系统默认配额，或配置自己的 API Key 以获得无限制使用。
