// 各コマンドの処理
const dayjs  = require('dayjs');
const chalk = require('chalk');
const uuid  = require('uuid');

const fileHandling = require('./fileManager');
const { saveTaskList, clearTask, findTaskById, checkFileExists, getTaskList, partialMatchList } = fileHandling;

// タスクを登録
function register(task) {
  if (!task) {
    console.log(`タスクを入力してください。`);
    return;
  }
  const id = uuid.v4();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);
  const isCompleted = false;
  // タスクのオブジェクト
  const newTask = { id: id, task: task, createdAt: createdAt, isCompleted: isCompleted };
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
    console.log((`タスクがありません。`));
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
  if (tasks.length === 0) {
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

module.exports = {
  register,
  list,
  done,
  deleteTask,
  partialMatch
};