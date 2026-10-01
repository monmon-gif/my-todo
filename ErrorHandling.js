const chalk = require('chalk');

// エラーハンドリング
function responseError(error) {
  // メッセージ内容
  let message;

  if (error.response) {
    message = error.response.data?.message || error.message;
  } else if ( error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' ) {
    message = 'ネットワークエラー（kintoneに接続できません。）';
  } else {
    message = error.message;
  }

  // エラー内容メッセージ
  console.error(chalk.default.red(message));
}

module.exports = {
  responseError
};