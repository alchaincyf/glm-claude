/**
 * 欢迎界面
 */

const chalk = require('chalk');
const boxen = require('boxen');
const { PROJECT_NAME, PROJECT_DESCRIPTION } = require('../config/constants');

/**
 * 显示欢迎信息
 */
function showWelcome() {
  console.clear();

  const welcomeMessage =
    chalk.bold.cyan(`🎉 欢迎使用 ${PROJECT_NAME}!`) + '\n\n' +
    chalk.gray(PROJECT_DESCRIPTION) + '\n' +
    chalk.gray('让你轻松使用国产大模型进行 AI 编程');

  console.log(boxen(welcomeMessage, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    textAlignment: 'center'
  }));
}

/**
 * 显示配置完成信息
 */
function showConfigSuccess() {
  console.log('\n' + boxen(
    chalk.green.bold('✅ 配置完成!') + '\n\n' +
    chalk.gray('即将启动 Claude Code...') + '\n' +
    chalk.gray('你可以开始享受 AI 编程的乐趣了!'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));
}

module.exports = {
  showWelcome,
  showConfigSuccess
};
