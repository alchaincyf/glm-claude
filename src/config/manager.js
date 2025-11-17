/**
 * 配置管理器
 * 负责读取、保存、验证配置信息
 */

const Conf = require('conf');
const path = require('path');
const os = require('os');
const { CONFIG_NAME, MODELS, GLM_BASE_URL } = require('./constants');

class ConfigManager {
  constructor() {
    this.config = new Conf({
      projectName: CONFIG_NAME,
      // 配置文件存储在 ~/.config/glm-claude/config.json
      cwd: path.join(os.homedir(), '.config', CONFIG_NAME)
    });
  }

  /**
   * 检查是否已配置 API Key
   */
  hasApiKey() {
    return this.config.has('apiKey') && !!this.config.get('apiKey');
  }

  /**
   * 获取 API Key
   */
  getApiKey() {
    return this.config.get('apiKey');
  }

  /**
   * 获取基础 URL
   */
  getBaseUrl() {
    return this.config.get('baseUrl', GLM_BASE_URL);
  }

  /**
   * 获取默认模型
   */
  getDefaultModel() {
    return this.config.get('defaultModel', 'glm-4.6');
  }

  /**
   * 保存配置
   * @param {Object} data - 配置数据
   * @param {string} data.apiKey - API Key
   * @param {string} [data.defaultModel] - 默认模型
   */
  save(data) {
    this.config.set('apiKey', data.apiKey);
    this.config.set('defaultModel', data.defaultModel || 'glm-4.6');
    this.config.set('baseUrl', GLM_BASE_URL);
    this.config.set('configuredAt', new Date().toISOString());
    this.config.set('version', '1.0.0');
  }

  /**
   * 重置所有配置
   */
  reset() {
    this.config.clear();
  }

  /**
   * 获取所有配置
   */
  getAll() {
    return this.config.store;
  }

  /**
   * 获取配置文件路径
   */
  getConfigPath() {
    return this.config.path;
  }

  /**
   * 显示配置（隐藏 API Key）
   */
  getSafeConfig() {
    const config = this.getAll();
    if (config.apiKey) {
      // 只显示前 8 位和后 4 位
      const key = config.apiKey;
      config.apiKey = `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
    }
    return config;
  }
}

module.exports = ConfigManager;
