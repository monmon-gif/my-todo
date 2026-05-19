// 各コマンドの処理
const dayjs  = require('dayjs');

const chalk = require('chalk');
const uuid  = require('uuid');
const axios = require('axios');

const fileHandling = require('./fileManager');
const { saveTaskList, getTaskList } = fileHandling;
const taskRepository = require('./taskRepository');
const { findTaskById, clearTask, partialMatchList, getCompletedTasks } = taskRepository;
const taskFormatter = require('./taskFormatter');
const { formatTask } = taskFormatter;

const dotenv = require('dotenv');
dotenv.config();
const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

// タスクを登録
async function register(title, priority) {
  if (!title) {
    console.log(`タスク名を入力してください。`);
    return;
  }
  if (priority !== `high` && priority !== `low`) {
    priority = `medium`;
  }
  const taskId = uuid.v4();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);

  try {
    await axios.post(`${KINTONE_BASE_URL}/k/v1/record.json`, {
      app: KINTONE_APP_ID,
      record: {
        taskId: { value: taskId },
        title: { value: title },
        done: { value: [] },
        priority: { value: priority },
        createdAt: { value: createdAt }
      }
    }, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    console.log(chalk.default.green(`タスクを追加しました。`));
  } catch (error) {
    console.error(chalk.default.red(`タスクの追加に失敗しました。`));
    console.error(error.status || error.response.data);
  }
};

// タスクの一覧表示
async function list(options) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: options.done ? `done in ("完了")` : options.todo ? `done not in ("完了")` : undefined
      }
    });
    if (response.data.records.length === 0) {
      console.log(`タスクがありません。`);
      return;
    }
    const tasks = response.data.records;
    if(tasks.length === 0){
      if (options.done) {
        console.log((`完了したタスクがありません。`));
        return;
      } else if (options.todo) {
        console.log((`未完了のタスクがありません。`));
        return;
      }
      console.log(`タスクがありません。`);
      return;
    }
    formatTask(tasks);
  } catch (error) {
    console.error(chalk.default.red(`タスクの取得に失敗しました。`));
    console.error(error.status || error.response.data);
    return;
  }
}

// タスクを完了
async function done(taskId) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: `taskId = "${taskId}"`
      }
    });

    if (response.data.records.length === 0) {
      console.log(`タスクIDが見つかりませんでした。`);
      return;
    }

    const recordId = response.data.records[0].$id.value;

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
    console.log(chalk.default.green(`タスクを完了しました。`));
  } catch (error) {
    console.error(chalk.default.red(`タスクの完了に失敗しました。`));
    console.error(error.status || error.response.data);
    return;
  }
}

// タスクを削除
async function deleteTask(taskId) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: `taskId = "${taskId}"`
      }
    });

    if (response.data.records.length === 0) {
      console.log(`タスクIDが見つかりませんでした。`);
      return;
    }
    const recordId = response.data.records[0].$id.value;
    console.log(recordId);
    await axios.delete(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      data: {
        app: KINTONE_APP_ID,
        ids: [recordId]
      }
    });
    console.log(chalk.default.yellow(`タスクを削除しました。`));
  } catch (error) {    
    console.error(chalk.default.red(`タスクの削除に失敗しました。`));
    console.error(error.status || error.response.data);
    return;
  }
}

// タスク名の部分一致検索
async function partialMatch(title) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: `title like "${title}"`
      }
    });
    if (response.data.records.length === 0) {
      console.log(`一致するタスクがありません。`);
      return;
    }
    const tasks = response.data.records;
    formatTask(tasks);
  } catch (error) {
    console.error(chalk.default.red(`タスクの検索に失敗しました。`));
    console.error(error.status || error.response.data);
    return;
  }
}

async function statisticsDisplay() {

  try {
    // タスクの取得
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID
      }
    });
    if (response.data.records.length === 0) {
      console.log(`タスクがありません。`);
      return;
    }
    // 全タスク数
    const tasks = response.data.records.length;
    // 直近7日以内に作成されたタスク数
    const oneWeekAgo = dayjs().subtract(7, 'day');
    const oneWeekTasks = response.data.records.filter(task => {
      return !dayjs(task.createdAt.value).isBefore(oneWeekAgo);
    });
    // 完了タスク数
    const completedTasks = response.data.records.filter(task => {
      return task.done.value.includes("完了");
    }).length;
    // 完了率
    const completionRate = Math.round((completedTasks / tasks) * 100);

    if(tasks === 0){
      console.log(`タスクがありません。`);
      return;
    } else if (oneWeekTasks.length === 0) {
      console.log(`直近7日以内に作成したタスクがありません。`);
    } else {
      console.log(`全タスク数: ${tasks}`);
      console.log(`完了タスク数: ${completedTasks}`);
      console.log(`未完了タスク数: ${tasks - completedTasks}`);
      console.log(`完了率: ${completionRate}%`);
      console.log(`直近7日以内に作成されたタスク数: ${oneWeekTasks.length}`);
    }
  } catch (error) {   
    console.error(chalk.default.red(`タスクの取得に失敗しました。`));
    console.error(error.status || error.response.data);
    return;
  }
}

module.exports = {
  register,
  list,
  done,
  deleteTask,
  partialMatch,
  statisticsDisplay
};