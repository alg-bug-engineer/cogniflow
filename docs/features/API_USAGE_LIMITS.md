# API 使用次数限制功能文档

## 功能概述

为了合理分配 AI 资源，系统现在支持基于用户类型的 API 使用次数限制，并允许用户配置个人 API Key：

- **注册用户**：100 次 AI 功能调用（包括卡片记录和智能报告）
- **快捷登录用户**：50 次 AI 功能调用
- **配置个人 API Key**：不受次数限制

## 功能特性

### 1. 自动识别用户类型

系统会根据用户注册方式自动设置账户类型：

- 通过正常注册流程注册的用户 → `registered` 类型，100 次额度
- 通过"快速体验"创建的用户（用户名以 `guest_` 开头）→ `quick_login` 类型，50 次额度

### 2. 使用次数扣减

以下操作会消耗 API 使用次数：

1. **创建卡片记录**：当输入文本通过 AI 处理时
2. **生成智能报告**：在报告页面点击"生成报告"按钮时

> **注意**：只有在 PostgreSQL 模式下才会进行使用次数限制。本地模式（IndexedDB）不受限制。

### 3. UI 提示

- **登录/注册页面**：在表单底部以小字提醒用户可用次数
- **使用时提醒**：当使用次数不足时，会显示错误提示
- **剩余次数显示**：生成报告成功后会显示剩余次数

## 数据库变更

### 新增字段（users 表）

```sql
-- 账户类型
account_type VARCHAR(20) DEFAULT 'registered' 
  CHECK (account_type IN ('registered', 'quick_login'))

-- 当前使用次数
api_usage_count INTEGER DEFAULT 0

-- 最大使用次数
max_api_usage INTEGER DEFAULT 100

-- 重置时间（预留字段，可用于实现月度重置等功能）
usage_reset_at TIMESTAMP WITH TIME ZONE
```

### 新增函数

1. **check_and_increment_api_usage(user_id)** - 检查并扣减使用次数
2. **get_user_api_usage(user_id)** - 获取用户使用情况
3. **reset_user_api_usage(user_id)** - 重置使用次数（管理员功能）
4. **set_initial_api_limits()** - 注册时自动设置限制的触发器函数

## API 接口

### 1. 获取用户 API 使用情况

```
GET /api/users/api-usage
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "currentUsage": 15,
  "maxUsage": 100,
  "remaining": 85,
  "accountType": "registered"
}
```

### 2. 检查并扣减使用次数

```
POST /api/users/check-api-usage
Authorization: Bearer <token>
```

**响应示例（成功）**：
```json
{
  "success": true,
  "remaining": 84,
  "message": "使用次数已扣减"
}
```

**响应示例（失败）**：
```json
{
  "success": false,
  "remaining": 0,
  "error": "已达到 API 使用次数上限"
}
```

### 3. 重置用户使用次数（管理员）

```
POST /api/users/:userId/reset-api-usage
Authorization: Bearer <admin-token>
```

## 部署说明

### 唯一部署方式

CogniFlow 使用统一的一键部署脚本，所有功能已内置：

```bash
./deploy-all.sh
```

⚠️ **重要提示**：
- 此脚本会清空所有现有数据
- 包含最新的所有功能（包括 API 使用次数限制）
- 适用于新部署和重新部署
- **不需要**单独的迁移操作

### 部署步骤

1. **执行部署脚本**
   ```bash
   cd /path/to/cogniflow
   ./deploy-all.sh
   ```

2. **确认操作**
   输入 `yes` 确认部署

3. **等待完成**
   脚本会自动完成所有初始化

4. **启动服务**
   ```bash
   pnpm run dev:postgres
   ```

### 验证部署

部署完成后，验证功能是否正常：

```bash
# 验证脚本
./database/verify-deployment-docker.sh

# 或手动检查
docker exec cogniflow-postgres psql -U cogniflow_user -d cogniflow -c "\d users"
```

应该看到以下字段：
- `account_type` - 账户类型
- `api_usage_count` - 当前使用次数
- `max_api_usage` - 最大使用次数
- `usage_reset_at` - 重置时间

## 前端实现

### 检查逻辑

```typescript
import { checkApiUsageBeforeAction } from '@/services/apiUsageService';

// 在调用 AI 功能前检查
const usageCheck = await checkApiUsageBeforeAction('卡片记录创建');
if (!usageCheck.canProceed) {
  toast.error(usageCheck.message || 'API 使用次数已达上限');
  return;
}

// 继续执行 AI 处理
const aiResult = await processTextWithAI(text);
```

### UI 提示

在登录/注册表单底部添加：

```tsx
<p className="text-[10px] text-center text-muted-foreground/70">
  * 注册用户可使用 100 次 AI 功能，快捷登录用户可使用 50 次
</p>
```

## 管理功能

### 查看所有用户使用情况

```sql
SELECT 
  username,
  account_type,
  api_usage_count as used,
  max_api_usage as max,
  max_api_usage - api_usage_count as remaining,
  ROUND(api_usage_count::NUMERIC / max_api_usage * 100, 2) as usage_percent
FROM users
ORDER BY api_usage_count DESC;
```

### 批量重置使用次数

```sql
-- 重置所有用户（谨慎使用）
UPDATE users 
SET api_usage_count = 0, 
    usage_reset_at = CURRENT_TIMESTAMP;

-- 重置指定用户
SELECT reset_user_api_usage('<user_id>');
```

### 调整用户限额

```sql
-- 提升特定用户的限额
UPDATE users 
SET max_api_usage = 200 
WHERE username = 'vip_user';

-- 批量提升注册用户限额
UPDATE users 
SET max_api_usage = 150 
WHERE account_type = 'registered';
```

## 未来扩展

预留的 `usage_reset_at` 字段可用于实现：

1. **月度重置**：每月自动重置所有用户的使用次数
2. **订阅模式**：根据订阅级别设置不同的限额
3. **使用报告**：分析用户使用模式和趋势

## 常见问题

### Q: 本地模式下会限制使用次数吗？

A: 不会。使用次数限制仅在 PostgreSQL 模式（`VITE_USE_POSTGRES=true`）下生效。本地 IndexedDB 模式不受限制。

### Q: 如何查看自己的剩余次数？

A: 在个人设置页面可以查看，或者在生成报告时会提示剩余次数。

### Q: 使用次数用完后怎么办？

A:
1. 配置个人智谱 AI API Key 以获得无限制使用（推荐）
2. 联系管理员申请重置或提升额度
3. 等待下次重置周期（如果实现了自动重置功能）

### Q: 为什么要区分注册用户和快捷登录用户？

A: 鼓励用户完成正式注册，提供更好的数据安全和跨设备同步体验。

### Q: 如何获取智谱 AI API Key？

A:
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制 API Key 到个人资料页面配置

### Q: 配置个人 API Key 安全吗？

A:
- API Key 存储在数据库中，仅用户本人可以查看和修改
- 管理员无法查看用户的 API Key
- 建议定期更换 API Key，不要分享给他人

## 版本信息

- **功能版本**: v1.1.0 (使用限制) + v1.2.0 (个人 API Key)
- **数据库迁移**: 008_api_usage_limits.sql
- **实施日期**: 2025-11-06
- **兼容性**: 向后兼容，不影响现有功能
