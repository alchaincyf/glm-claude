/**
 * API Key 验证器
 * 验证 GLM API Key 是否有效
 */

const axios = require('axios');
const { GLM_BASE_URL } = require('./constants');

/**
 * 验证 API Key 是否有效
 * @param {string} apiKey - 待验证的 API Key
 * @returns {Promise<{valid: boolean, message?: string, warning?: string}>}
 */
async function validateApiKey(apiKey) {
  try {
    // 调用 GLM API 验证 key 是否有效
    // 使用最小的请求来验证
    const response = await axios.post(
      `${GLM_BASE_URL}/v1/messages`,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        validateStatus: (status) => {
          // 200-299 和 429 都认为是有效的
          return (status >= 200 && status < 300) || status === 429;
        }
      }
    );

    if (response.status === 429) {
      // API Key 有效，但额度不足
      return {
        valid: true,
        warning: '⚠️  API Key 有效，但当前额度不足或达到速率限制'
      };
    }

    return { valid: true };

  } catch (error) {
    // 处理各种错误情况
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return {
          valid: false,
          message: '❌ API Key 无效，请检查后重试'
        };
      } else if (status === 403) {
        return {
          valid: false,
          message: '❌ API Key 权限不足或已被禁用'
        };
      } else if (status === 429) {
        // 即使 429，key 也是有效的
        return {
          valid: true,
          warning: '⚠️  API Key 有效，但当前额度不足或达到速率限制'
        };
      } else {
        return {
          valid: false,
          message: `❌ 验证失败 (HTTP ${status}): ${error.response.statusText}`
        };
      }
    } else if (error.code === 'ECONNABORTED') {
      return {
        valid: false,
        message: '❌ 验证超时，请检查网络连接'
      };
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        valid: false,
        message: '❌ 无法连接到 GLM API，请检查网络连接'
      };
    } else {
      return {
        valid: false,
        message: `❌ 验证失败: ${error.message}`
      };
    }
  }
}

/**
 * 简单的 API Key 格式验证
 * @param {string} apiKey - API Key
 * @returns {boolean}
 */
function validateApiKeyFormat(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // API Key 应该是非空字符串，长度合理
  const trimmed = apiKey.trim();
  return trimmed.length >= 20 && trimmed.length <= 200;
}

module.exports = {
  validateApiKey,
  validateApiKeyFormat
};
