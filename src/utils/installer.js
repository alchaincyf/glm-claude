/**
 * 安装相关工具函数
 *
 * 注意：主要的 Claude Code 安装逻辑已移至 cli.js 中
 * 此文件仅保留一些通用工具函数
 */

const { spawnSync } = require('child_process');

/**
 * 检查命令是否存在
 * @param {string} command - 命令名
 * @returns {boolean}
 */
function commandExists(command) {
  try {
    const result = spawnSync(
      process.platform === 'win32' ? 'where' : 'which',
      [command],
      { stdio: 'pipe' }
    );
    return result.status === 0;
  } catch (error) {
    return false;
  }
}

module.exports = {
  commandExists
};
