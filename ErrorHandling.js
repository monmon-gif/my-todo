const chalk = require('chalk');

// エラーハンドリング
function responseError(error){
  if (error.response !== undefined) {
    console.log(chalk.default.red(error.response.status));
    if (error.response.status === 400) {
      console.error(chalk.default.red(`APIトークンが間違っています。`));
    }
  } else {
    console.log(chalk.default.red(error.code));
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(chalk.default.red(`ネットワークエラー（kintoneに接続できません。）`));
    }
  }
  console.error(chalk.default.red(error.message));
}

module.exports = {
  responseError
};