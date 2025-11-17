/**
 * GLM Claude 配置常量
 */

module.exports = {
  // GLM API 配置
  GLM_BASE_URL: 'https://api.z.ai/api/anthropic',
  GLM_API_WEBSITE: 'https://open.bigmodel.cn/',

  // 支持的模型
  MODELS: {
    'glm-4.6': {
      name: 'GLM-4.6',
      description: '最新旗舰模型，推荐使用',
      anthropicModel: 'claude-3-5-sonnet-20241022'
    },
    'glm-4.5-air': {
      name: 'GLM-4.5-Air',
      description: '轻量快速模型',
      anthropicModel: 'claude-3-haiku-20240307'
    }
  },

  // 配置文件名
  CONFIG_NAME: 'glm-claude',

  // 项目信息
  PROJECT_NAME: 'GLM Code',
  PROJECT_DESCRIPTION: '智谱 GLM 驱动的 Claude Code',
  PROJECT_AUTHOR: '花叔',
  WECHAT_PUBLIC_ACCOUNT: '花叔',

  // GitHub 仓库
  GITHUB_REPO: 'https://github.com/alchaincyf/glm-claude',
  ISSUES_URL: 'https://github.com/alchaincyf/glm-claude/issues'
};
