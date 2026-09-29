const chalk = require('chalk');

const dotenv = require('dotenv');
dotenv.config();

const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

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

// 環境変数不足チェック
function envCheck() {
  if (!KINTONE_BASE_URL || !KINTONE_APP_ID || !KINTONE_API_TOKEN) {
    // エラーを投げる
    throw new Error('環境変数が設定されていません。');
  }
}

module.exports = {
  responseError,
  envCheck
};