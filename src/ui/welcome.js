/**
 * 欢迎界面
 */

const chalk = require('chalk');
const boxen = require('boxen');
const { PROJECT_NAME, PROJECT_DESCRIPTION, PROJECT_AUTHOR, WECHAT_PUBLIC_ACCOUNT } = require('../config/constants');
const { showInstalledSkills } = require('../utils/skills-installer');

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
    chalk.gray('正在为你安装专业技能包...'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));
}

/**
 * 显示启动前的欢迎信息
 */
function showLaunchWelcome() {
  // 简洁的单行欢迎信息，不清屏，不打断用户
  const welcomeLine =
    chalk.cyan('🎉 ') +
    chalk.bold.cyan(PROJECT_NAME) +
    chalk.gray(` by ${PROJECT_AUTHOR}`) +
    chalk.gray(' | ') +
    chalk.gray(`问题反馈：公众号「${WECHAT_PUBLIC_ACCOUNT}」`);

  console.log('\n' + welcomeLine + '\n');
}

/**
 * 显示 Skills 安装完成信息
 */
function showSkillsInstalled() {
  console.log('\n' + boxen(
    chalk.green.bold('🚀 专业技能包安装完成!') + '\n\n' +
    chalk.gray('你已获得以下专业能力:') + '\n' +
    chalk.white('  • AI味审校 - 降低AI检测率，增加人味') + '\n' +
    chalk.white('  • 图片配图与上传 - 自动生成文章配图') + '\n' +
    chalk.white('  • 个人素材库搜索 - 搜索真实经历案例') + '\n' +
    chalk.white('  • 视频封标与承接检查 - 优化视频点击率') + '\n' +
    chalk.gray('  ... 等10个专业技能\n') +
    chalk.gray('现在你可以直接使用这些专业能力了!'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'yellow'
    }
  ));

  // 显示已安装的技能列表
  setTimeout(() => {
    showInstalledSkills();
  }, 1000);
}

module.exports = {
  showWelcome,
  showConfigSuccess,
  showLaunchWelcome,
  showSkillsInstalled
};
