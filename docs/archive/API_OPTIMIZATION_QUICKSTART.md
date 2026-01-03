# 🚀 API 优化功能 - 快速开始

## 一键部署

```bash
# 1. 运行完整部署脚本（v1.2.0，包含个人 API Key 功能）
./deploy-all.sh

# 2. 等待部署完成，脚本会自动：
#    - 部署数据库（包含 personal_api_key 字段）
#    - 部署后端和前端服务
#    - 验证功能状态
#    - 显示 API 使用说明
```

## 快速测试

### 1. 注册新用户（不配置 API Key）
1. 访问 http://localhost:5173/register
2. 填写用户名、邮箱、密码
3. 不填写"智谱 AI API Key"字段
4. 点击"注册"
5. ✅ 注册成功，默认有 100 次 API 调用配额

### 2. 查看 API 使用情况
1. 登录后访问个人资料页面
2. 查看"API 配置"卡片
3. ✅ 应该显示：
   - API 调用次数: 0 / 100
   - 进度条显示 0%
   - 剩余 100 次调用机会

### 3. 配置个人 API Key
1. 在"API 配置"卡片中
2. 输入智谱 AI API Key
3. 点击"保存 API Key"
4. ✅ 保存成功后显示：
   - "已配置个人 API"标识
   - API 调用次数显示"无限制"
   - 不再显示进度条

### 4. 测试 AI 功能
1. 创建一个新的卡片
2. 上传一张图片
3. ✅ 应该使用你配置的个人 API Key 进行分析

### 5. 删除 API Key
1. 在"API 配置"卡片中
2. 点击"删除 API Key"
3. 确认删除
4. ✅ 删除成功后：
   - 恢复显示配额限制
   - 重新显示进度条
   - 剩余次数根据之前使用情况显示

## 常见问题

### Q: 如何获取智谱 API Key？
**A**: 访问 https://open.bigmodel.cn/ 注册并创建 API Key

### Q: 配置 API Key 后是否立即生效？
**A**: 是的，保存后立即生效，下次 AI 调用会使用你的 API Key

### Q: 可以随时更换 API Key 吗？
**A**: 可以，在个人资料页面随时更新

### Q: 删除 API Key 后之前的使用次数会恢复吗？
**A**: 不会，已使用的次数会保留

### Q: 达到限制后必须配置 API Key 吗？
**A**: 是的，达到限制后需要配置个人 API Key 才能继续使用 AI 功能

## 验证部署成功

### 检查数据库
```bash
docker exec -it cogniflow-postgres psql -U cogniflow_user -d cogniflow

# 检查 users 表是否有 personal_api_key 字段
\d users

# 应该看到:
# personal_api_key | character varying(500) |

# 退出
\q
```

### 检查前端
- 注册页面应该有"智谱 AI API Key"输入框
- 个人资料页面应该有"API 配置"卡片

### 检查后端
```bash
# 查看服务日志
docker-compose logs server

# 应该没有错误信息
```

## 下一步

- 📖 阅读完整文档: [API_OPTIMIZATION.md](./API_OPTIMIZATION.md)
- 📝 查看更新总结: [API_OPTIMIZATION_README.md](./API_OPTIMIZATION_README.md)
- 🐛 遇到问题查看故障排查部分

---

**提示**: 第一次部署时会清空数据库，建议在测试环境先试用！
