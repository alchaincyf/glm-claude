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
    chalk.gray('1. 访问: ') + chalk.cyan(GLM_API_WEBSITE) + '\n' +
    chalk.gray('2. 注册/登录账号\n') +
    chalk.gray('3. 进入「API 管理」\n') +
    chalk.gray('4. 创建 API Key\n') +
    chalk.gray('5. 复制 API Key 并粘贴到下方'),
    {
      padding: 1,
      borderColor: 'cyan',
      borderStyle: 'round'
    }
  ));
  console.log('');
}

/**
 * 显示订阅信息
 */
function showSubscriptionInfo() {
  console.log('\n' + boxen(
    chalk.yellow.bold('💡 关于订阅') + '\n\n' +
    chalk.gray('GLM API 提供免费额度和付费套餐\n') +
    chalk.gray('访问 ') + chalk.cyan(GLM_API_WEBSITE) + chalk.gray(' 查看详情\n\n') +
    chalk.gray('免费额度通常足够个人开发使用'),
    {
      padding: 1,
      borderColor: 'yellow',
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

  // 询问是否已有 API Key
  const { hasApiKey } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasApiKey',
      message: '你已经有 GLM API Key 了吗?',
      default: false
    }
  ]);

  // 如果没有，显示获取指南
  if (!hasApiKey) {
    showApiKeyGuide();
    showSubscriptionInfo();
  }

  // 获取 API Key
  let apiKey;
  let isValid = false;

  while (!isValid) {
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

    apiKey = answer.apiKey.trim();

    // 询问是否验证 API Key
    const { shouldValidate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldValidate',
        message: '是否在线验证 API Key?（推荐）',
        default: true
      }
    ]);

    if (shouldValidate) {
      const spinner = ora('正在验证 API Key...').start();

      const result = await validateApiKey(apiKey);

      if (result.valid) {
        spinner.succeed(chalk.green('API Key 验证成功!'));
        if (result.warning) {
          console.log(chalk.yellow(`  ${result.warning}`));
        }
        isValid = true;
      } else {
        spinner.fail(chalk.red('API Key 验证失败'));
        console.log(chalk.red(`  ${result.message}`));

        const { retry } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'retry',
            message: '是否重新输入 API Key?',
            default: true
          }
        ]);

        if (!retry) {
          console.log(chalk.yellow('\n配置已取消'));
          process.exit(0);
        }
      }
    } else {
      // 跳过验证
      isValid = true;
    }
  }

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
  showSubscriptionInfo,
  confirmReconfigure
};
