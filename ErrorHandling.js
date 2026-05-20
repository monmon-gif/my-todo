const chalk = require('chalk');

// エラーハンドリング
function responseError(error){
  if (error.response?.status === 401) {
    console.error(chalk.default.red(`APIトークンが間違っています。`));
  } else if (error.response?.status === 403) {
    console.error(chalk.default.red(`環境変数が設定されていません。`));
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.error(chalk.default.red(`ネットワークエラー（kintoneに接続できません。）`));
  } else {
    console.error(chalk.default.red(`不明なエラーが発生しました。`));
  }
  console.error(chalk.default.red(error.message));
  console.error(chalk.default.red(error.response.status));
}

module.exports = {
  responseError
};