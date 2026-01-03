# CogniFlow 文档中心# CogniFlow 文档中心



欢迎使用 CogniFlow！这里是完整的文档导航。## 📚 文档导航



---### 用户文档

- [用户手册](../USER_MANUAL.md) - 完整的功能使用指南

## 📚 文档目录

### 开发文档

### 🎯 快速上手- [开发指南](./DEVELOPER_GUIDE.md) - 开发者文档

- [部署指南](../DEPLOYMENT_CHECKLIST.md) - 生产环境部署

新用户建议按此顺序阅读：

### 功能文档

1. **[快速开始](./quickstart/QUICK_START.md)** ⭐ 必读- [自动备份快速开始](./AUTO_BACKUP_QUICKSTART.md) - 备份功能快速上手

   - 3步完成部署- [自动备份详细指南](./AUTO_BACKUP_GUIDE.md) - 备份功能完整说明

   - 一键部署脚本说明- [日历和重复日程](./CALENDAR_AND_RECURRENCE_GUIDE.md) - 日历功能说明

   - 常见问题解决- [URL 智能处理](./URL_FEATURE_GUIDE.md) - URL 功能说明



2. **[启动指南](./quickstart/STARTUP_GUIDE.md)**### API 配置

   - 详细的启动步骤- [GLM API 快速配置](./GLM_QUICK_START.md) - 智谱 AI 配置指南

   - 环境配置说明- [GLM API 迁移文档](./GLM_API_MIGRATION.md) - API 迁移说明



3. **[PostgreSQL 快速开始](./quickstart/QUICKSTART_POSTGRES.md)**### 更新日志

   - 数据库快速配置- [变更日志](./CHANGELOG.md) - 版本更新记录

   - Docker 部署说明

---

---

## 📖 快速导航

### 📖 用户指南

### 我是新用户

完整的功能使用说明：1. 阅读 [用户手册](../USER_MANUAL.md)

2. 配置 [GLM API](./GLM_QUICK_START.md)

- **[用户手册](./user-guide/USER_MANUAL.md)** ⭐ 核心文档3. 了解 [自动备份功能](./AUTO_BACKUP_QUICKSTART.md)

  - 所有功能的详细说明

  - 使用技巧和最佳实践### 我是开发者

  1. 阅读 [开发指南](./DEVELOPER_GUIDE.md)

- **[界面指南](./user-guide/USER_INTERFACE_GUIDE.md)**2. 配置开发环境

  - 界面布局说明3. 了解项目架构

  - 操作流程图解

  ### 我要部署应用

- **[用户系统](./user-guide/USER_SYSTEM_GUIDE.md)**1. 阅读 [部署指南](../DEPLOYMENT_CHECKLIST.md)

  - 用户管理2. 配置生产环境

  - 权限说明3. 执行部署流程



------



### 🛠️ 开发文档## 🔍 文档说明



开发者必读：### 用户手册

面向终端用户的完整使用指南，包含所有功能的详细说明和使用方法。

- **[开发指南](./development/DEVELOPER_GUIDE.md)** ⭐ 开发者入门

  - 项目架构### 开发指南

  - 开发环境配置面向开发者的技术文档，包含项目结构、技术栈、数据库设计、开发规范等。

  - 代码规范

  ### 功能文档

- **[数据库指南](./development/DATABASE_GUIDE.md)**各个功能模块的详细说明文档，深入介绍特定功能的使用方法和最佳实践。

  - 数据库设计

  - 表结构说明### API 配置

  - SQL 操作示例第三方 API 的配置和集成说明，帮助快速配置外部服务。

  

- **[数据库迁移](./development/DATABASE_MIGRATION_GUIDE.md)**---

  - 数据库版本管理

  - 迁移脚本**维护者**：CogniFlow Team  

  **最后更新**：2025-01-29

- **[测试指南](./development/TESTING_GUIDE.md)**
  - 测试策略
  - 单元测试
  - 集成测试

---

### 🚀 部署运维

生产环境部署：

- **[部署指南](./deployment/DEPLOYMENT_GUIDE.md)** ⭐ 生产部署必读
  - 生产环境配置
  - 部署检查清单
  - 性能优化
  
- **[数据库部署](./deployment/DATABASE_DEPLOYMENT_GUIDE.md)**
  - PostgreSQL 生产配置
  - 备份策略
  - 性能调优
  
- **[安全指南](./deployment/SECURITY_GUIDE.md)**
  - 安全配置
  - 权限管理
  - 最佳实践

---

### 📖 功能说明

详细的功能文档：

#### AI 功能
- **[智能模板](./features/SMART_TEMPLATES.md)**
  - 模板系统说明
  - 自定义模板
  - 触发词配置
  
- **[智能模板快速开始](./features/SMART_TEMPLATES_QUICKSTART.md)**
  - 快速上手指南
  - 常用模板示例

#### 核心功能
- **[时间冲突检测](./features/CONFLICT_DETECTION.md)**
  - 冲突检测机制
  - 配置说明
  
- **[冲突检测指南](./features/CONFLICT_DETECTION_GUIDE.md)**
  - 使用指南
  - 最佳实践

#### 数据管理
- **[自动备份](./features/AUTO_BACKUP.md)**
  - 自动备份功能
  - 备份策略配置
  
- **[自动备份快速开始](./features/AUTO_BACKUP_QUICKSTART.md)**
  - 快速配置指南

#### 其他功能
- **[URL 智能处理](./features/URL_PROCESSING.md)**
  - URL 自动识别
  - 元数据提取
  
- **[日历和重复日程](./features/CALENDAR_AND_RECURRENCE_GUIDE.md)**
  - 日历功能
  - 重复日程设置

---

### 🔧 配置说明

系统配置文档：

- **[GLM API 配置](./configuration/GLM_SETUP.md)** ⭐ AI 功能必需
  - 智谱 AI 配置
  - API Key 获取
  - 调用限制说明

---

### 📱 移动端

- **[移动端优化](../MOBILE_OPTIMIZATION.md)**
  - 移动端适配说明
  - 响应式设计
  
- **[移动端测试指南](../MOBILE_TESTING_GUIDE.md)**
  - 测试步骤
  - 常见问题

---

### 📝 其他文档

- **[更新日志](./CHANGELOG.md)**
  - 版本更新记录
  - 新功能说明
  
- **[PRD 文档](./prd.md)**
  - 产品需求文档
  - 功能规划

---

## 🗂️ 文档结构

```
docs/
├── README.md                       # 本文档（文档导航中心）
├── CHANGELOG.md                    # 更新日志
├── prd.md                          # 产品需求文档
├── DESIGN_SYSTEM.md                # 设计系统文档
│
├── quickstart/                     # 快速开始
│   ├── QUICK_START.md             # 快速开始指南 ⭐
│   ├── STARTUP_GUIDE.md           # 启动指南
│   ├── QUICKSTART_POSTGRES.md     # PostgreSQL 快速开始
│   ├── API_USAGE_LIMITS_QUICKSTART.md
│   ├── ATTACHMENT_IMAGE_QUICKSTART.md
│   ├── BLOG_QUICKSTART.md
│   ├── REMINDER_QUICKSTART.md
│   ├── VOICE_INPUT_QUICKSTART.md
│   └── STARTUP_GUIDE.md
│
├── user-guide/                     # 用户指南
│   ├── USER_MANUAL.md             # 用户手册 ⭐
│   ├── USER_INTERFACE_GUIDE.md    # 界面指南
│   ├── USER_SYSTEM_GUIDE.md       # 用户系统指南
│   ├── VOICE_INPUT_GUIDE.md       # 语音输入指南
│   └── MANUAL_UPDATE_2025-11-05.md
│
├── development/                    # 开发文档
│   ├── DEVELOPER_GUIDE.md         # 开发指南 ⭐
│   ├── DATABASE_GUIDE.md          # 数据库指南
│   ├── DATABASE_MIGRATION_GUIDE.md
│   └── TESTING_GUIDE.md           # 测试指南
│
├── deployment/                     # 部署文档
│   ├── DEPLOYMENT_GUIDE.md        # 部署指南 ⭐
│   ├── DATABASE_DEPLOYMENT_GUIDE.md
│   ├── SECURITY_GUIDE.md          # 安全指南
│   ├── ALIYUN_ECS_DEPLOYMENT.md   # 阿里云部署
│   ├── FILE_STORAGE_CONFIG.md     # 文件存储配置
│   └── FILE_STORAGE_SOLUTION.md
│
├── features/                       # 功能说明
│   ├── API_USAGE_LIMITS.md        # API 使用限制
│   ├── ATTACHMENTS.md             # 附件功能 🆕
│   ├── AUTO_BACKUP.md
│   ├── AUTO_BACKUP_QUICKSTART.md
│   ├── BLOG_EDITOR_OPTIMIZATION.md
│   ├── BLOG_WRITING_FEATURE.md
│   ├── CALENDAR_AND_RECURRENCE_GUIDE.md
│   ├── CONFLICT_DETECTION.md
│   ├── CONFLICT_DETECTION_GUIDE.md
│   ├── REMINDER_IMPLEMENTATION.md
│   ├── REMINDER_SETUP.md
│   ├── SMART_REPORT_ENHANCEMENT.md
│   ├── SMART_TEMPLATES.md
│   ├── SMART_TEMPLATES_QUICKSTART.md
│   ├── SMART_URL_CARD.md
│   ├── URL_PROCESSING.md
│   ├── VOICE_INPUT.md
│   └── VOICE_INPUT_IMPLEMENTATION.md
│
├── configuration/                  # 配置说明
│   ├── ENVIRONMENT.md             # 环境变量配置
│   ├── GLM_SETUP.md               # GLM API 配置
│   └── ATTACHMENT_CONFIG.md       # 附件配置 🆕
│
├── fixes/                          # 问题修复文档
│   ├── 404_ERROR_FIX.md
│   ├── AUTH_TOKEN_PERSISTENCE_FIX.md
│   ├── BLOG_EDITOR_FIXES.md
│   ├── CONFLICT_DETECTION_OPTIMIZATION.md
│   └── DEPLOYMENT_REMINDER_FIX.md
│
└── archive/                        # 归档文档（已过时）
    ├── API_OPTIMIZATION_*.md
    ├── ATTACHMENT_*.md
    ├── BUGFIX_20251105.md
    ├── COLOR_*_*.md
    ├── DEPLOYMENT_*.md
    └── ...其他历史文档
```

---

## 🎯 推荐阅读路径

### 新用户路径
1. [快速开始](./quickstart/QUICK_START.md)
2. [用户手册](./user-guide/USER_MANUAL.md)
3. [GLM API 配置](./configuration/GLM_SETUP.md)
4. [智能模板快速开始](./features/SMART_TEMPLATES_QUICKSTART.md)

### 开发者路径
1. [快速开始](./quickstart/QUICK_START.md)
2. [开发指南](./development/DEVELOPER_GUIDE.md)
3. [数据库指南](./development/DATABASE_GUIDE.md)
4. [测试指南](./development/TESTING_GUIDE.md)

### 运维人员路径
1. [快速开始](./quickstart/QUICK_START.md)
2. [部署指南](./deployment/DEPLOYMENT_GUIDE.md)
3. [数据库部署](./deployment/DATABASE_DEPLOYMENT_GUIDE.md)
4. [安全指南](./deployment/SECURITY_GUIDE.md)

---

## 📞 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/alg-bug-engineer/cogniflow/issues)
- **文档问题**: 如果文档有错误或不清楚，请提交 Issue
- **功能建议**: 欢迎在 Issues 中提出新功能建议

---

## 🔄 文档更新

文档持续更新中，最后更新：2025年11月3日

查看 [CHANGELOG.md](./CHANGELOG.md) 了解最新变更。

---

**CogniFlow 团队** 📝
