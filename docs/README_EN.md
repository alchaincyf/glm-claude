# GLM Code - Claude Code Powered by GLM

<div align="center">

[![npm version](https://img.shields.io/npm/v/glm-claude.svg)](https://www.npmjs.com/package/glm-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

**One-click launch of Claude Code powered by Chinese GLM models**

No manual environment setup | Interactive configuration | Works out of the box

English | [简体中文](../README.md)

</div>

---

## ✨ Features

- 🚀 **One-Click Launch** - Just type `glm` and start coding
- 🔧 **Auto Configuration** - Interactive setup, no manual environment variables
- 📦 **Auto Installation** - Automatically detects and installs Claude Code
- 🇨🇳 **Chinese Models** - Powered by Zhipu GLM-4.6/4.5 models
- 💾 **Persistent Config** - API Key saved securely, configure once
- 🎨 **Friendly UI** - Colorful output with clear prompts
- ✅ **Online Validation** - Optional API Key verification

## 📦 Installation

```bash
npm install -g glm-claude
```

**Requirements:**
- Node.js >= 18.0.0
- npm >= 8.0.0

## 🚀 Quick Start

### First Time Use

Run in any project directory:

```bash
glm
```

The CLI will guide you through:

1. ✅ Check if you have an API Key
2. 📖 Show how to get one if needed
3. 🔑 Enter API Key (with optional verification)
4. ⚙️ Choose default model (GLM-4.6 or GLM-4.5-Air)
5. 🚀 Auto-launch Claude Code

### Subsequent Use

After configuration, simply run:

```bash
glm
```

That's it!

## 🔑 Getting API Key

1. Visit [Zhipu AI Open Platform](https://open.bigmodel.cn/)
2. Register/Login
3. Go to "API Management"
4. Create API Key
5. Copy the generated key

**💡 Tip:** GLM provides free quota sufficient for personal development

## 📖 Commands

### Basic Commands

```bash
glm                    # Launch Claude Code
glm --help             # Show help
glm --version          # Show version
```

### Configuration

```bash
glm config             # Reconfigure API Key
glm config --show      # Show current config (hides sensitive data)
glm config --reset     # Reset all configuration
```

## 🌟 Supported Models

| Model | Description | Use Case |
|-------|-------------|----------|
| **GLM-4.6** | Latest flagship model (recommended) | Complex coding, refactoring |
| **GLM-4.5-Air** | Lightweight fast model | Quick queries, rapid iteration |

## 🔧 Advanced Configuration

Configuration file location:
```
~/.config/glm-claude/config.json
```

## 🐛 Troubleshooting

### `claude` command not found

**Solution:**

```bash
npm install -g @anthropic-ai/claude-code
```

### API Key validation failed

**Solutions:**

1. Verify API Key correctness
2. Check network connection
3. Reset and reconfigure:
   ```bash
   glm config --reset
   glm
   ```

## 📊 Comparison

| Feature | Original Way | GLM Code |
|---------|-------------|-----------|
| Install Steps | 3-4 steps | **1 step** |
| Configuration | Manual env vars | **Interactive** |
| Usage | Set env vars each time | **One command** |
| API Key | Must remember/lookup | **Persistent** |
| Guidance | Self-search | **Auto-display** |
| Error Handling | Not friendly | **Detailed prompts** |

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](../LICENSE)

## 🔗 Links

- [Claude Code Official](https://github.com/anthropics/claude-code)
- [Zhipu AI Platform](https://open.bigmodel.cn/)
- [Report Issues](https://github.com/YOUR_USERNAME/glm-claude/issues)

---

<div align="center">

**If this project helps you, please give it a Star ⭐️**

Made with ❤️ by the community

</div>
