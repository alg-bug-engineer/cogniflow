# 📊 一键部署集成对比

## 更新前 vs 更新后

### users 表结构对比

#### 更新前
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    
    -- API 限制字段
    account_type VARCHAR(20) DEFAULT 'registered',
    api_usage_count INTEGER DEFAULT 0,
    max_api_usage INTEGER DEFAULT 100,
    usage_reset_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

#### 更新后 ✅
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    
    -- API 限制字段
    account_type VARCHAR(20) DEFAULT 'registered',
    api_usage_count INTEGER DEFAULT 0,
    max_api_usage INTEGER DEFAULT 100,
    usage_reset_at TIMESTAMP WITH TIME ZONE,
    
    -- ⭐ 新增: 个人 API Key 字段
    personal_api_key VARCHAR(500),  -- ← 新增
    
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

---

### check_and_increment_api_usage 函数对比

#### 更新前
```sql
CREATE OR REPLACE FUNCTION check_and_increment_api_usage(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, current_count INTEGER, max_count INTEGER, message TEXT)
AS $$
DECLARE
    v_current_count INTEGER;
    v_max_count INTEGER;
BEGIN
    SELECT api_usage_count, max_api_usage 
    INTO v_current_count, v_max_count
    FROM users WHERE id = p_user_id;
    
    -- 检查限制
    IF v_current_count >= v_max_count THEN
        RETURN QUERY SELECT false, v_current_count, v_max_count, 
                           '已达到使用限制'::TEXT;
        RETURN;
    END IF;
    
    -- 扣减
    UPDATE users SET api_usage_count = api_usage_count + 1
    WHERE id = p_user_id;
    
    RETURN QUERY SELECT true, v_current_count + 1, v_max_count, 
                       '使用次数已扣减'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

#### 更新后 ✅
```sql
CREATE OR REPLACE FUNCTION check_and_increment_api_usage(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, current_count INTEGER, max_count INTEGER, message TEXT)
AS $$
DECLARE
    v_current_count INTEGER;
    v_max_count INTEGER;
    v_has_personal_key BOOLEAN;  -- ← 新增
BEGIN
    -- ⭐ 新增: 检查是否有个人 API Key
    SELECT 
        api_usage_count,
        max_api_usage,
        personal_api_key IS NOT NULL AND personal_api_key != ''
    INTO v_current_count, v_max_count, v_has_personal_key
    FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0, 0, '用户不存在'::TEXT;
        RETURN;
    END IF;
    
    -- ⭐ 新增: 如果有个人 API Key，不限制
    IF v_has_personal_key THEN
        UPDATE users SET api_usage_count = api_usage_count + 1
        WHERE id = p_user_id;
        
        RETURN QUERY SELECT true, v_current_count + 1, -1,  -- -1 表示无限制
                           '使用个人 API Key，无限制'::TEXT;
        RETURN;
    END IF;
    
    -- 原有逻辑: 检查限制
    IF v_current_count >= v_max_count THEN
        RETURN QUERY SELECT false, v_current_count, v_max_count, 
                           '已达到使用限制，请配置个人 API Key'::TEXT;
        RETURN;
    END IF;
    
    -- 原有逻辑: 扣减
    UPDATE users SET api_usage_count = api_usage_count + 1
    WHERE id = p_user_id;
    
    RETURN QUERY SELECT true, v_current_count + 1, v_max_count, 
                       '使用次数已扣减'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

---

### get_user_api_usage 函数对比

#### 更新前
```sql
CREATE OR REPLACE FUNCTION get_user_api_usage(p_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    username VARCHAR(50),
    account_type VARCHAR(20),
    current_usage INTEGER,
    max_usage INTEGER,
    remaining INTEGER,
    usage_reset_at TIMESTAMP WITH TIME ZONE
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.account_type,
        u.api_usage_count,
        u.max_api_usage,
        u.max_api_usage - u.api_usage_count as remaining,
        u.usage_reset_at
    FROM users u
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

#### 更新后 ✅
```sql
CREATE OR REPLACE FUNCTION get_user_api_usage(p_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    username VARCHAR(50),
    account_type VARCHAR(20),
    current_usage INTEGER,
    max_usage INTEGER,
    remaining INTEGER,
    has_personal_key BOOLEAN,  -- ← 新增字段
    usage_reset_at TIMESTAMP WITH TIME ZONE
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.account_type,
        u.api_usage_count,
        u.max_api_usage,
        -- ⭐ 新增: 有个人 API Key 时 remaining = -1
        CASE 
            WHEN u.personal_api_key IS NOT NULL AND u.personal_api_key != '' 
            THEN -1
            ELSE u.max_api_usage - u.api_usage_count
        END as remaining,
        -- ⭐ 新增: 返回是否有个人 API Key
        (u.personal_api_key IS NOT NULL AND u.personal_api_key != '') as has_personal_key,
        u.usage_reset_at
    FROM users u
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 部署脚本变化

### deploy.sql 和 01_schema.sql

| 变更内容 | 行数位置 | 状态 |
|---------|---------|------|
| 添加 `personal_api_key` 字段 | ~56 行 | ✅ 已集成 |
| 创建 personal_api_key 索引 | ~75 行 | ✅ 已集成 |
| 添加字段注释 | ~79-82 行 | ✅ 已集成 |
| 更新 check_and_increment_api_usage | ~395-460 行 | ✅ 已集成 |
| 更新 get_user_api_usage | ~462-490 行 | ✅ 已集成 |

---

## 索引变化

### 新增索引

```sql
-- 为 personal_api_key 创建部分索引
CREATE INDEX idx_users_personal_api_key ON users(personal_api_key) 
WHERE personal_api_key IS NOT NULL;
```

**说明**: 
- 只为非空的 personal_api_key 创建索引
- 节省存储空间
- 提高查询效率

---

## 注释变化

### 新增注释

```sql
COMMENT ON COLUMN users.personal_api_key IS 
    '用户个人的智谱 API Key，配置后将优先使用，不受次数限制';

COMMENT ON COLUMN users.api_usage_count IS 
    'API 使用次数计数器';

COMMENT ON COLUMN users.max_api_usage IS 
    'API 最大使用次数限制（注册用户100次，快速登录50次）';

COMMENT ON COLUMN users.account_type IS 
    '账户类型：registered（注册用户）、quick_login（快速登录）';
```

---

## 功能对比

### 更新前

```
用户注册 → 获得默认配额（100次）
         ↓
      使用 AI 功能
         ↓
    检查配额是否达到限制
         ↓
    是: 无法继续使用 ❌
    否: 继续使用 ✅
```

### 更新后 ✅

```
用户注册 → 获得默认配额（100次）
         ↓
   可选配置个人 API Key  ← 新增
         ↓
      使用 AI 功能
         ↓
  检查是否有个人 API Key  ← 新增
         ↓
    是: 无限制使用 ♾️   ← 新增
    否: 检查配额限制
         ↓
    达到限制: 提示配置 API Key  ← 优化
    未达到: 继续使用 ✅
```

---

## 部署命令对比

### 更新前
```bash
# 只能使用一种方式
cd database
./deploy-database-docker.sh
```

### 更新后 ✅
```bash
# 推荐方式: 一键完整部署（v1.2.0，包含所有新功能）
./deploy-all.sh

# 生产环境: 增量迁移（保留数据，添加新功能）
docker exec -i cogniflow-postgres psql -U cogniflow_user -d cogniflow \
  < database/migrations/008_add_personal_api_key.sql
```

---

## 总结

### ✅ 集成完成度: 100%

| 项目 | 状态 | 说明 |
|------|------|------|
| 表结构 | ✅ 已集成 | personal_api_key 字段已添加 |
| 索引 | ✅ 已集成 | 部分索引已创建 |
| 函数 | ✅ 已集成 | 两个核心函数已更新 |
| 注释 | ✅ 已集成 | 所有字段注释已添加 |
| 部署脚本 | ✅ 已更新 | deploy.sql 和 01_schema.sql |
| 一键部署 | ✅ v1.2.0 | deploy-all.sh 包含完整功能 |
| 迁移脚本 | ✅ 已创建 | 008_add_personal_api_key.sql |
| 文档 | ✅ 完整 | 6个说明文档 |

### 🎯 关键改进

1. **向后兼容**: ✅ 现有功能不受影响
2. **无缝集成**: ✅ 一键部署自动包含（v1.2.0）
3. **统一部署**: ✅ deploy-all.sh 包含所有功能
4. **完整文档**: ✅ 详细的说明和验证步骤

---

**对比完成时间**: 2025年11月6日  
**集成状态**: ✅ 完全集成  
**向后兼容**: ✅ 是  
**可以部署**: ✅ 是
