const chalk = require('chalk');

// エラーハンドリング
function responseError(error){
  // エラーステータス
  const status = error.response?.status;

  if (status === 400) {
    console.error(chalk.default.red(`APIトークンが間違っています。`));
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.error(chalk.default.red(`ネットワークエラー（kintoneに接続できません。）`));
  }

  // 環境変数の不足などのメッセージ。400以外もAPIトークン
  console.error(chalk.default.red(error.message));
}

module.exports = {
  responseError
};