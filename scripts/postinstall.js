#!/usr/bin/env node

/**
 * 安装后脚本
 * 显示安装成功信息和快速开始指南
 */

// 检查依赖是否已安装
try {
  var chalk = require('chalk');
  var boxen = require('boxen');
} catch (error) {
  // 依赖还未安装完成，静默退出
  process.exit(0);
}

const message =
  chalk.green.bold('✅ GLM Claude 安装成功!') + '\n\n' +
  chalk.cyan.bold('快速开始:') + '\n' +
  chalk.gray('  1. 在任意项目目录运行: ') + chalk.yellow('glm') + '\n' +
  chalk.gray('  2. 首次使用会引导你配置 API Key\n') +
  chalk.gray('  3. 开始享受 AI 编程的乐趣!\n\n') +
  chalk.cyan.bold('获取 API Key:') + '\n' +
  chalk.gray('  访问 ') + chalk.cyan('https://open.bigmodel.cn/') + '\n\n' +
  chalk.cyan.bold('查看帮助:') + '\n' +
  chalk.gray('  运行 ') + chalk.yellow('glm --help') + chalk.gray(' 查看所有命令\n\n') +
  chalk.cyan.bold('配置管理:') + '\n' +
  chalk.gray('  ') + chalk.yellow('glm config --show') + chalk.gray('   显示当前配置\n') +
  chalk.gray('  ') + chalk.yellow('glm config --reset') + chalk.gray('  重置配置');

console.log('\n' + boxen(message, {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'green'
}));

console.log(chalk.gray('\n感谢使用 GLM Claude! 如有问题欢迎提 Issue\n'));
