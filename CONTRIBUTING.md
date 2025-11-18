# 贡献指南

感谢你考虑为 GLM Code 做出贡献！

## 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 检查 [Issues](https://github.com/YOUR_USERNAME/glm-claude/issues) 确认问题未被报告
2. 创建新的 Issue，提供详细信息：
   - 问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（Node.js 版本、操作系统等）

### 提交代码

1. **Fork 仓库**

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发**
   - 遵循现有代码风格
   - 添加必要的注释
   - 确保代码可读性

4. **测试**
   ```bash
   npm test
   ```

5. **提交**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建/工具链相关

6. **推送**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**

## 开发设置

```bash
# 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/glm-claude.git
cd glm-claude

# 安装依赖
npm install

# 本地链接以便测试
npm link

# 测试命令
glm --help
```

## 代码规范

- 使用 2 空格缩进
- 使用分号
- 使用单引号（除非必要）
- 函数和变量使用驼峰命名
- 常量使用大写下划线命名
- 添加 JSDoc 注释

## Pull Request 检查清单

- [ ] 代码遵循项目风格
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 添加了测试（如适用）
- [ ] 所有测试通过
- [ ] 提交信息清晰明确

## 许可证

通过贡献，你同意你的贡献将在 MIT 许可证下发布。
