# 🚀 GLM Code - 智谱 GLM 驱动的 AI 编程助手

<div align="center">

[![npm version](https://img.shields.io/npm/v/glm-claude.svg)](https://www.npmjs.com/package/glm-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

**一键让 Claude Code 使用智谱 GLM 模型，预装 10 个专业技能**

🎯 **写作创作** | 🎬 **视频制作** | 💡 **效率提升** | 🇨🇳 **中文优化**

[English](./docs/README_EN.md) | 简体中文

</div>

---

## 💡 这个项目解决什么问题？

Claude Code 是 Anthropic 官方推出的 AI 编程助手，功能强大但：
- ❌ **需要 Claude 官方订阅** - 每月 20 美元（约 145 元人民币）
- ❌ **需要国际信用卡** - 国内用户支付困难
- ❌ **访问受限** - 部分地区网络访问不稳定

**GLM Code 的解决方案：**
- ✅ **使用国产大模型** - 接入智谱 GLM-4.6 等国内领先大模型
- ✅ **价格更实惠** - **低至 20 元/月**，仅为 Claude 官方价格的 **1/7**
- ✅ **支付便捷** - 支持支付宝、微信等国内支付方式
- ✅ **访问稳定** - 国内服务器，无需魔法上网
- 🆕 **预装专业技能** - **10个写作和视频创作技能**，开箱即用

## 🎯 核心价值

### 原来的方式（繁琐 😫）

1. 安装 Claude Code：`npm install -g @anthropic-ai/claude-code`
2. 获取 GLM API Key（需要自己研究）
3. 手动设置环境变量：
   ```bash
   export ANTHROPIC_AUTH_TOKEN="你的key"
   export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
   ```
4. 每次使用都要设置环境变量
5. 切换项目需要重新配置

### 使用 GLM Claude（简单 🎉）

```bash
# 1. 安装
npm install -g glm-claude

# 2. 启动（首次会引导配置）
glm
```

**就这么简单！** 首次运行会自动引导你获取 API Key 并配置，之后每次只需输入 `glm` 即可使用。

## 📦 快速开始

### 安装

```bash
npm install -g glm-claude
```

**系统要求：**
- Node.js >= 18.0.0
- npm >= 8.0.0

### 首次使用

安装后，在任意项目目录运行：

```bash
glm
```

程序会自动引导你：

1. **询问是否有 API Key** ✋
   - 如果还没有，会显示获取指南

2. **输入 API Key** 🔑
   - 支持在线验证，确保 Key 有效

3. **选择默认模型** 🤖
   - GLM-4.6（推荐）- 最新旗舰模型
   - GLM-4.5-Air - 轻量快速模型

4. **自动启动 Claude Code** 🚀
   - 配置完成后立即可用

### 后续使用

配置完成后，每次只需：

```bash
glm
```

就能启动使用 GLM 模型的 Claude Code！

## 🔑 如何获取 GLM API Key

### 方案一：订阅 GLM 服务（推荐 ⭐）

**价格优势明显：**
- 💰 **低至 20 元/月** - Claude 官方订阅价格的 1/7
- 💳 **支付便捷** - 支持支付宝、微信
- 🚀 **即开即用** - 无需等待审核

**订阅步骤：**

1. 访问订阅页面：**[点击这里订阅 GLM 服务](https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR)**

2. 选择合适的套餐：
   - 💎 基础版：20 元/月（适合个人开发）
   - 💎 专业版：更多配额（适合团队使用）

3. 完成支付后，进入控制台获取 API Key

4. 在首次运行 `glm` 时输入 API Key

### 方案二：使用免费额度

智谱 AI 提供免费试用额度，适合测试和轻度使用：

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入「API 管理」
4. 创建 API Key
5. 查看免费额度

**💡 提示：** 免费额度有限，推荐订阅以获得稳定服务。

## ✨ 功能特性

### 🎨 用户体验

- **零配置** - 首次运行自动引导配置
- **交互式向导** - 清晰的步骤提示，新手友好
- **配置持久化** - 配置一次，永久使用
- **彩色输出** - 美观的命令行界面
- **智能检测** - 自动检测并安装 Claude Code

### 🚀 专业技能（v1.3.0 新增 🆕）

**预装 10 个专业技能，开箱即用：**

#### 🥇 核心技能（P0 - 必装）
- **AI味审校** - 降低AI检测率至30%以下，三遍审校流程增加人味
- **图片配图与上传** - 自动生成文章配图，支持AI生成/图库/自动上传
- **个人素材库搜索** - 搜索真实经历案例，增加内容真实性

#### 🥈 高价值技能（P1 - 推荐）
- **视频封标与承接检查** - MrBeast策略优化视频点击率和观看时长
- **视频脚本口语化审校** - 让脚本更适合录制，去除书面化表达
- **Prompt分类保存** - 自动分类管理prompts，支持5大分类
- **选题生成** - 快速生成高质量文章选题，包含完整分析

#### 🥉 辅助技能（P2 - 可选）
- **长文转X内容** - 文章转换为社交媒体内容，适配多平台
- **视频大纲生成** - 生成视频脚本方案，包含缩略图设计建议
- **信息搜索与知识管理** - 新产品技术搜索验证，自动保存知识库

### 🔒 安全可靠

- **本地存储** - API Key 安全存储在本地
- **在线验证** - 可选的 API Key 有效性验证
- **隐私保护** - 显示配置时自动隐藏敏感信息

### 🛠️ 功能完整

- **多模型支持** - GLM-4.6、GLM-4.5-Air
- **灵活配置** - 支持查看、修改、重置配置
- **完整测试** - 单元测试覆盖率 100%

## 📖 命令列表

### 基础命令

```bash
glm                    # 启动 Claude Code（使用 GLM 模型）
glm --help             # 显示帮助信息
glm --version          # 显示版本号
```

### 🚀 专业技能使用

安装完成后，专业技能会自动加载，你只需要用自然语言描述需求：

#### 写作创作类
```bash
# AI味审校
"帮我审校这篇文章，让它更像人写的"

# 图片配图
"给这篇文章配个图"

# 选题生成
"帮我生成几个关于AI的选题"

# 素材搜索
"搜索一些相关的真实案例"
```

#### 视频制作类
```bash
# 视频优化
"检查一下我的视频标题和封面"

# 脚本口语化
"把这个脚本改得口语化一点"

# 视频大纲
"帮我生成一个视频脚本大纲"
```

#### 管理工具类
```bash
# Prompt管理
"保存这个prompt"

# 信息搜索
"帮我了解一下最新的AI技术"
```

### 配置管理

```bash
glm config             # 重新配置 API Key
glm config --show      # 显示当前配置（隐藏敏感信息）
glm config --reset     # 重置所有配置
```

### 配置示例

#### 查看当前配置

```bash
$ glm config --show

当前配置:
──────────────────────────────────────────────────
API Key:      abcd1234...xyz9
Base URL:     https://api.z.ai/api/anthropic
默认模型:      glm-4.6
配置时间:      2024/1/15 10:30:25
配置文件:      ~/.config/glm-claude/config.json
──────────────────────────────────────────────────
```

#### 重新配置

```bash
$ glm config

这将覆盖现有配置，确定要继续吗? (y/N)
```

## 🌟 支持的模型

| 模型 | 描述 | 适用场景 | 推荐度 |
|------|------|----------|--------|
| **GLM-4.6** | 最新旗舰模型 | 复杂编程任务、代码重构、架构设计 | ⭐⭐⭐⭐⭐ |
| **GLM-4.5-Air** | 轻量快速模型 | 简单查询、快速迭代、代码补全 | ⭐⭐⭐⭐ |

## 💰 费用对比

| 方案 | 月费用 | 支付方式 | 访问稳定性 | 推荐度 |
|------|--------|----------|------------|--------|
| Claude 官方订阅 | ~145 元 | 国际信用卡 | 需要魔法上网 | ⭐⭐⭐ |
| **GLM Claude（订阅）** | **20 元起** | **支付宝/微信** | **国内稳定** | **⭐⭐⭐⭐⭐** |
| GLM 免费额度 | 0 元 | - | 国内稳定 | ⭐⭐⭐⭐ |

**💡 推荐：** 订阅 GLM 服务，性价比最高！

## 🔧 高级配置

### 配置文件位置

配置文件默认存储在：
```
~/.config/glm-claude/config.json
```

### 配置文件格式

```json
{
  "apiKey": "your-api-key-here",
  "baseUrl": "https://api.z.ai/api/anthropic",
  "defaultModel": "glm-4.6",
  "configuredAt": "2024-01-15T10:30:25.000Z",
  "version": "1.0.0"
}
```

### 手动编辑配置

虽然不推荐，但你可以直接编辑配置文件：

```bash
# 打开配置文件
vim ~/.config/glm-claude/config.json
```

**⚠️ 注意：** 修改后建议运行 `glm config --show` 验证配置是否正确。

## 🐛 故障排除

### 问题：提示找不到 `claude` 命令

**可能原因：** Claude Code 未正确安装

**解决方案：**

GLM Claude 会自动安装 Claude Code，但如果失败，请手动安装：

```bash
npm install -g @anthropic-ai/claude-code
```

### 问题：API Key 验证失败

**可能原因：**
- API Key 输入错误
- API Key 已过期或被禁用
- 网络连接问题
- 额度不足

**解决方案：**

1. 检查 API Key 是否正确
2. 访问 [GLM 订阅页面](https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR) 检查额度
3. 重新配置：
   ```bash
   glm config --reset
   glm
   ```

### 问题：无法启动 Claude Code

**解决方案：**

```bash
# 1. 查看当前配置
glm config --show

# 2. 重置配置
glm config --reset

# 3. 重新配置
glm
```

### 问题：权限错误

**解决方案：**

```bash
# macOS/Linux - 使用 sudo
sudo npm install -g glm-claude

# 或配置 npm 全局目录
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## 📊 与原始方式对比

| 对比项 | 原始方式 | GLM Claude | 优势 |
|--------|---------|-----------|------|
| **安装步骤** | 3-4 步 | **1 步** | ✅ 简化 75% |
| **配置难度** | 需手动设置环境变量 | **交互式向导** | ✅ 新手友好 |
| **使用便利** | 每次需设置环境变量 | **一键启动** | ✅ 省时省力 |
| **API Key 管理** | 需要记住或查找 | **持久化保存** | ✅ 自动管理 |
| **订阅引导** | 需自己研究 | **自动显示** | ✅ 省心 |
| **错误提示** | 不够友好 | **详细引导** | ✅ 易于调试 |
| **月费用** | ~145 元 | **20 元起** | ✅ 省钱 86% |

## 🤝 贡献

欢迎贡献代码、报告问题和提出建议！

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/alchain/glm-claude.git
cd glm-claude

# 安装依赖
npm install

# 本地测试
npm link
glm --help

# 运行测试
npm test
```

### 提交 Pull Request

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 开启 Pull Request

详见 [贡献指南](CONTRIBUTING.md)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- **GLM 订阅**：https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR（推荐，20 元/月起）
- **npm 包**：https://www.npmjs.com/package/glm-claude
- **GitHub 仓库**：https://github.com/alchain/glm-claude
- **问题反馈**：https://github.com/alchain/glm-claude/issues
- **Claude Code 官方**：https://github.com/anthropics/claude-code
- **智谱 AI 开放平台**：https://open.bigmodel.cn/

## 💖 致谢

- [Anthropic](https://www.anthropic.com/) - Claude Code
- [智谱 AI](https://www.zhipuai.cn/) - GLM 大模型
- 所有贡献者和使用者

## ⭐ Star History

如果这个项目对你有帮助，欢迎给个 Star ⭐️

---

<div align="center">

**📱 立即订阅 GLM 服务，开启高效 AI 编程之旅！**

[点击订阅（低至 20 元/月）](https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR)

Made with ❤️ by [alchain](https://github.com/alchain)

</div>
