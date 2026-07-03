const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();
const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

// タスク登録処理
async function taskRegister(taskContent){
  await axios.post(`${KINTONE_BASE_URL}/k/v1/record.json`, {
  app: KINTONE_APP_ID,
  record: {
    taskId: { value: taskContent.taskId },
    title: { value: taskContent.title },
    done: { value: [] },
    priority: { value: taskContent.priority },
    createdAt: { value: taskContent.createdAt }
  }
}, {
  headers: {
    'X-Cybozu-API-Token': KINTONE_API_TOKEN,
    'Content-Type': 'application/json'
  }
});
return true;
}

// タスクの一覧表示処理
async function taskList(params) {
  const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
    },
    params: {
      app: KINTONE_APP_ID,
      query: params
    }
  });
  return response.data.records;
}

// タスクID検索処理
async function taskIdSearch(taskId) {
  const escapedTaskId = escape(taskId);
  const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
    },
    params: {
      app: KINTONE_APP_ID,
      query: `taskId = "${escapedTaskId}"`
    }
  });
  return response.data.records;
}

//  タスクを完了処理
async function taskDone(recordId) {
  await axios.put(`${KINTONE_BASE_URL}/k/v1/record.json`, {
    app: KINTONE_APP_ID,
    id: recordId,
    record: {
      done: { value: ["完了"] }
    }
  }, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  return true;
}

// タスクを削除処理
async function taskDelete(recordId) {
  await axios.delete(`${KINTONE_BASE_URL}/k/v1/records.json`, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
    },
    data: {
      app: KINTONE_APP_ID,
      ids: [recordId]
    }
  });
  return true;
}

// タスク名の部分一致検索処理
async function taskPartialMatch(title) {
  const escapedTitle = escape(title);
  const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
    },
    params: {
      app: KINTONE_APP_ID,
      query: `title like "${escapedTitle}"`
    }
  });
  return response.data.records;
}

// エスケープ処理
function escape(str){
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// 環境変数のチェック（実行時にチェック）
function envCheck() {
  if (!KINTONE_BASE_URL || !KINTONE_APP_ID || !KINTONE_API_TOKEN) {
    console.error(chalk.default.red(`環境変数が設定されていません。`));
  }
}

module.exports = {
  taskRegister,
  taskList,
  taskIdSearch,
  taskDone,
  taskDelete,
  taskPartialMatch,
  envCheck
};