// 各コマンドの処理
const dayjs  = require('dayjs');
// 現在日時
const nowDate = dayjs().format(`YYYY-MM-DD HH:mm`);
// 1週間前の日時
const oneWeekAgo = dayjs().subtract(7, 'day').format(`YYYY-MM-DD HH:mm`);

const chalk = require('chalk');
const uuid  = require('uuid');

const fileHandling = require('./fileManager');
const { saveTaskList, clearTask, findTaskById, checkFileExists, getTaskList, partialMatchList, getCompletedTasks } = fileHandling;

// タスクを登録
function register(task, priority) {
  if (!task) {
    console.log(`タスクを入力してください。`);
    return;
  }
  if (priority !== `high` && priority !== `low`) {
    priority = `medium`;
  }
  const id = uuid.v4();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);
  const isCompleted = false;
  // タスクのオブジェクト
  const newTask = { id: id, task: task, createdAt: createdAt, isCompleted: isCompleted, priority: priority };
  // JSONファイルの確認
  checkFileExists();
  const tasks = getTaskList();

  tasks.push(newTask);
  const isSaved = saveTaskList(tasks);
  if (isSaved) {
    console.log(chalk.default.green(`タスクを追加しました。`));
  } else {
    console.log(chalk.default.red(`タスクの追加に失敗しました。`));
  }
};

// タスクの一覧表示
function list(options) {
  // JSONファイルの確認
  checkFileExists();
  const tasks = getTaskList(options);
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
  tasks.forEach(task => {
    if (task.isCompleted) {
      console.log(chalk.default.gray(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:完了\n`));
      return;
    } else {
      if (task.priority === `high`) {
        console.log(chalk.default.red(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:未完了\n`));
        return;
      } else if (task.priority === `medium`) {
        console.log(chalk.default.yellow(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:未完了\n`));
        return;
      } else {
        console.log(chalk.default.white(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:未完了\n`));
        return;
      }
    }
  });
}

// タスクを完了
function done(taskId) {
  // JSONファイルの確認
  checkFileExists();
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
  // JSONファイルの確認
  checkFileExists();
  const task = findTaskById(taskId);
  if (!task){
    console.log(chalk.default.red(`タスクIDが見つかりませんでした。`));
    return;
  }
  clearTask(taskId);
  console.log(chalk.default.yellow(`タスクを削除しました。`));
}

// タスク名の部分一致検索
function partialMatch(taskName) {
  // JSONファイルの確認
  checkFileExists();
  const tasks = partialMatchList(taskName);
  if (tasks.length === 0 || !taskName) {
    console.log(`一致するタスクがありません。`);
    return;
  }
  tasks.forEach(task => {
    if (task.isCompleted) {
      console.log(chalk.default.gray(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:完了\n`));
      return;
    }
    console.log(chalk.default.white(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:未完了\n`));
  });
}

function statisticsDisplay() {
  // JSONファイルの確認
  checkFileExists();
  // 全タスク
  const tasks = getTaskList();
  // 1週間のタスク
  const oneWeekTasks = tasks.filter(task => task.createdAt >= oneWeekAgo && task.createdAt <= nowDate);
  // 全タスク数
  const totalTasks = tasks.length;
  // 完了タスク数
  const completedTasks = getCompletedTasks(tasks);
  // 1週間のタスク数
  const oneWeekTotalTasks = oneWeekTasks.length;
  // 四捨五入で完了率
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  if(totalTasks === 0 && oneWeekTotalTasks === 0){
    console.log(`タスクがありません。`);
    return;
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