/**
 * 交互式提示
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const boxen = require('boxen');
const ora = require('ora');
const { GLM_API_WEBSITE, MODELS } = require('../config/constants');
const { validateApiKey, validateApiKeyFormat } = require('../config/validator');

/**
 * 显示获取 API Key 的引导
 */
function showApiKeyGuide() {
  console.log('\n' + boxen(
    chalk.cyan.bold('📱 如何获取 GLM API Key') + '\n\n' +
    chalk.yellow.bold('1️⃣  如果还没有订阅，请先订阅 GLM 服务：') + '\n' +
    chalk.green('    低至 20 元/月，性价比高\n') +
    chalk.cyan('    订阅链接：https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR') + '\n\n' +
    chalk.yellow.bold('2️⃣  订阅完成后，或如果已经订阅，获取 API Key：') + '\n' +
    chalk.cyan('    API Key 获取链接：https://bigmodel.cn/usercenter/proj-mgmt/apikeys') + '\n\n' +
    chalk.gray('    • 登录后在「项目管理」中创建或查看 API Key\n') +
    chalk.gray('    • 复制 API Key 并粘贴到下方'),
    {
      padding: 1,
      borderColor: 'cyan',
      borderStyle: 'round'
    }
  ));
  console.log('');
}


/**
 * 首次配置提示
 * @returns {Promise<Object>} 配置信息
 */
async function showConfigPrompts() {
  console.log(chalk.cyan('\n🔧 首次使用需要配置 API Key\n'));

  // 直接显示获取指南
  showApiKeyGuide();

  // 获取 API Key（简化版，只需格式验证）
  const answer = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: '请输入你的 GLM API Key:',
      mask: '*',
      validate: (input) => {
        if (!input) {
          return '❌ API Key 不能为空';
        }
        if (!validateApiKeyFormat(input)) {
          return '❌ API Key 格式不正确（长度应在 20-200 个字符之间）';
        }
        return true;
      }
    }
  ]);

  const apiKey = answer.apiKey.trim();

  // 选择默认模型
  const { defaultModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultModel',
      message: '选择默认模型:',
      choices: Object.entries(MODELS).map(([key, model]) => ({
        name: `${model.name} - ${model.description}`,
        value: key
      })),
      default: 'glm-4.6'
    }
  ]);

  return {
    apiKey,
    defaultModel
  };
}

/**
 * 重新配置确认
 * @returns {Promise<boolean>}
 */
async function confirmReconfigure() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow('这将覆盖现有配置，确定要继续吗?'),
      default: false
    }
  ]);

  return confirm;
}

module.exports = {
  showConfigPrompts,
  showApiKeyGuide,
  confirmReconfigure
};
