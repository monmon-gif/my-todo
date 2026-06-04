const chalk = require('chalk');

// エラーハンドリング
function responseError(error){
  if (error.response !== undefined) {
    if (error.response.status === 400) {
      console.error(chalk.default.red(`APIトークンが正しくありません`));
    } else if (error.response.status === 403) {
      console.error(chalk.default.red(`アプリIDが正しくありません。`));
    } else {
      console.error(chalk.default.red(error.response.data.message));
    }
  } else {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(chalk.default.red(`ネットワークエラー（kintoneに接続できません。）`));
    }
  }
}

module.exports = {
  responseError
};