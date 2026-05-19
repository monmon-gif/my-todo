// 各コマンドの処理
const dayjs  = require('dayjs');

const chalk = require('chalk');
const uuid  = require('uuid');

const kintoneClient = require('./kintoneClient');
const { taskRegister, taskList, taskIdSearch, taskDone, taskDelete, taskPartialMatch } = kintoneClient;
const taskFormatter = require('./taskFormatter');
const { formatTask } = taskFormatter;

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
  // タスク内容
  const taskContent = { taskId, title, priority, createdAt };

  const isRegistered = await taskRegister(taskContent);
  if (isRegistered) {
    console.log(chalk.default.green(`タスクを登録しました。`));
  } else {
    console.log(chalk.default.red(`タスクの登録に失敗しました。`));
  }
};

// タスクの一覧表示
async function list(options) {
  const response = await taskList(options);
  if(response.length === 0){
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
  formatTask(response);
}

// タスクを完了
async function done(taskId) {
  const response = await taskIdSearch(taskId);
  if (response.length === 0) {
    console.log(`タスクIDが見つかりませんでした。`);
    return;
  }
  const recordId = response[0].$id.value;

  const isDone = await taskDone(recordId);
  if (isDone) {
    console.log(chalk.default.green(`タスクを完了しました。`));
  } else {
    console.log(chalk.default.red(`タスクの完了に失敗しました。`));
  }
}

// タスクを削除
async function deleteTask(taskId) {
  const response = await taskIdSearch(taskId);
  if (response.length === 0) {
    console.log(`タスクIDが見つかりませんでした。`);
    return;
  }
  const recordId = response[0].$id.value;

  const isDeleted = await taskDelete(recordId);
  if (isDeleted) {
    console.log(chalk.default.yellow(`タスクを削除しました。`));
  } else {
    console.log(chalk.default.red(`タスクの削除に失敗しました。`));
  }
}

// タスク名の部分一致検索
async function partialMatch(title) {
  const response = await taskPartialMatch(title);
  if (response.length === 0) {
    console.log(`一致するタスクがありません。`);
    return;
  }
  formatTask(response);
}

async function statisticsDisplay() {

  // タスクの取得
  const response = await taskList({});
  // 全タスク数
  const tasks = response.length;
  // 直近7日以内に作成されたタスク数
  const oneWeekAgo = dayjs().subtract(7, 'day');
  const oneWeekTasks = response.filter(task => {
    return !dayjs(task.createdAt.value).isBefore(oneWeekAgo);
  });
  // 完了タスク数
  const completedTasks = response.filter(task => {
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
}

module.exports = {
  register,
  list,
  done,
  deleteTask,
  partialMatch,
  statisticsDisplay
};