const chalk = require('chalk');

const dotenv = require('dotenv');
dotenv.config();
const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

// エラーハンドリング
function responseError(error){
  if (error.response.status === 400) {
    console.error(chalk.default.red(`APIトークンが間違っています。`));
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.error(chalk.default.red(`ネットワークエラー（kintoneに接続できません。）`));
  } else {
    console.error(chalk.default.red(`エラーが発生しました。`));
  }
  console.error(chalk.default.red(error.message));
  console.error(chalk.default.red(error.response.status));
}

// 環境変数のチェック（実行時にチェック）
function envCheck() {
  if (!KINTONE_BASE_URL || !KINTONE_APP_ID || !KINTONE_API_TOKEN) {
    console.error(chalk.default.red(`環境変数が設定されていません。`));
    process.exit(1);
  }
}
envCheck();

module.exports = {
  responseError
};