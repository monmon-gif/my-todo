// 各コマンドの処理
const dayjs  = require('dayjs');

const chalk = require('chalk');
const uuid  = require('uuid');

const taskFormatter = require('./taskFormatter');
const { formatTask } = taskFormatter;
const database = require('./database');
const { registerTask, getOptionalTasks, updateTaskDone, clearTask, countAllTasks } = database;

// タスクを登録
async function register(task, priority) {
  if (!task) {
    console.log(`タスクを入力してください。`);
    return;
  }
  if (priority !== `high` && priority !== `low`) {
    priority = `medium`;
  }
  const id = uuid.v4();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);
  const done = false;
  // タスクのオブジェクト
  const newTask = { id: id, title: task, createdAt: createdAt, done: done, priority: priority };

  const isRegistered = await registerTask(newTask);
  if (isRegistered) {
    console.log(chalk.default.green(`タスクを追加しました。`));
  } else {
    console.log(chalk.default.red(`タスクの追加に失敗しました。`));
  }
};

// タスクの一覧表示
async function list(options) {
  const tasks = await getOptionalTasks(options);
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
}

// タスクを完了
async function done(taskId) {
  const task = await getOptionalTasks({ taskId });
  if (!task){
    console.log(chalk.default.red(`タスクIDが見つかりませんでした。`));
    return;
  }
  const isSaved = await updateTaskDone({ taskId });
  if (isSaved) {
    console.log(chalk.default.green(`タスクを完了しました。`));
  } else {
    console.log(chalk.default.red(`タスクの完了に失敗しました。`));
  }
}

// タスクを削除
async function deleteTask(taskId) {
  const task = await getOptionalTasks({ taskId });
  if (!task){
    console.log(chalk.default.red(`タスクIDが見つかりませんでした。`));
    return;
  }
  const isDeleted = await clearTask(taskId);
  if (isDeleted) {
    console.log(chalk.default.yellow(`タスクを削除しました。`));
  } else {
    console.log(chalk.default.red(`タスクの削除に失敗しました。`));
  }
}

// タスク名の部分一致検索
async function partialMatch(taskName) {
  if (!taskName) {
    console.log(`タスク名を入力してください。`);
    return;
  }
  const tasks = await getOptionalTasks({ taskName });
  if (tasks.length === 0) {
    console.log(`一致するタスクがありません。`);
    return;
  }
  formatTask(tasks);
}

async function statisticsDisplay() {
  // 全タスク
  const allTasks = await countAllTasks();
  // 1週間前の日付
  const oneWeekAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss');
  // 1週間のタスク
  const oneWeekTasks = await countAllTasks({ oneWeekAgo });
  // 完了タスク数
  const completedTasks = await countAllTasks({ done: true });
  // 四捨五入で完了率
  const completionRate = Math.round((completedTasks / allTasks) * 100);

  if(allTasks === 0 ){
    console.log(`タスクがありません。`);
    return;
  } else if (oneWeekTasks === 0) {
    console.log(`直近7日以内に作成したタスクがありません。`);
  }
  console.log(`全タスク数: ${allTasks}`);
  console.log(`完了タスク数: ${completedTasks}`);
  console.log(`未完了タスク数: ${allTasks - completedTasks}`);
  console.log(`完了率: ${completionRate}%`);
  console.log(`直近7日以内に作成されたタスク数: ${oneWeekTasks}`);
}

module.exports = {
  register,
  list,
  done,
  deleteTask,
  partialMatch,
  statisticsDisplay
};