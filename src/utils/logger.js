/**
 * 日志工具
 * 提供统一的日志输出格式
 */

const chalk = require('chalk');

class Logger {
  /**
   * 成功信息
   */
  static success(message) {
    console.log(chalk.green('✅ ' + message));
  }

  /**
   * 错误信息
   */
  static error(message) {
    console.error(chalk.red('❌ ' + message));
  }

  /**
   * 警告信息
   */
  static warning(message) {
    console.log(chalk.yellow('⚠️  ' + message));
  }

  /**
   * 提示信息
   */
  static info(message) {
    console.log(chalk.cyan('ℹ️  ' + message));
  }

  /**
   * 调试信息（仅在开发模式显示）
   */
  static debug(message) {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🔍 ' + message));
    }
  }

  /**
   * 步骤信息
   */
  static step(step, total, message) {
    console.log(chalk.cyan(`[${step}/${total}] `) + message);
  }
}

module.exports = Logger;
