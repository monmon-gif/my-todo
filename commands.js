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
    console.error(error);
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
    console.error(error);
    return;
  }
}

// タスクを完了
function done(taskId) {
  const task = findTaskById(taskId);
  if (!task){
    console.log(chalk.default.red(`タスクIDが見つかりませんでした。`));
    return;
  }
  const tasks = getTaskList();
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, isCompleted: true };
    }
    return task;
  });
  const isSaved = saveTaskList(updatedTasks);
  if (isSaved) {
    console.log(chalk.default.green(`タスクを完了しました。`));
  } else {
    console.log(chalk.default.red(`タスクの完了に失敗しました。`));
  }
}

// タスクを削除
function deleteTask(taskId) {

  const task = findTaskById(taskId);
  if (!task){
    console.log(chalk.default.red(`タスクIDが見つかりませんでした。`));
    return;
  }
  clearTask(taskId);
  console.log(chalk.default.yellow(`タスクを削除しました。`));
}

// タスク名の部分一致検索
function partialMatch(title) {

  const tasks = partialMatchList(title);
  if (tasks.length === 0 || !title) {
    console.log(`一致するタスクがありません。`);
    return;
  }
  formatTask(tasks);
}

function statisticsDisplay() {

  // 全タスク
  const tasks = getTaskList();
  // 1週間前の日付
  const oneWeekAgo = dayjs().subtract(7, 'day');
  // 1週間のタスク
  const oneWeekTasks = tasks.filter(task => {
    return !dayjs(task.createdAt).isBefore(oneWeekAgo);
  });
  // 全タスク数
  const totalTasks = tasks.length;
  // 完了タスク数
  const completedTasks = getCompletedTasks(tasks);
  // 1週間のタスク数
  const oneWeekTotalTasks = oneWeekTasks.length;
  // 四捨五入で完了率
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  if(totalTasks === 0 ){
    console.log(`タスクがありません。`);
    return;
  } else if (oneWeekTotalTasks === 0) {
    console.log(`直近7日以内に作成したタスクがありません。`);
  }
  console.log(`全タスク数: ${totalTasks}`);
  console.log(`完了タスク数: ${completedTasks}`);
  console.log(`未完了タスク数: ${totalTasks - completedTasks}`);
  console.log(`完了率: ${completionRate}%`);
  console.log(`直近7日以内に作成されたタスク数: ${oneWeekTotalTasks}`);
}

module.exports = {
  register,
  list,
  done,
  deleteTask,
  partialMatch,
  statisticsDisplay
};