// 各コマンドの処理
const dayjs  = require('dayjs');
const chalk = require('chalk');
const uuid  = require('uuid');

const fileHandring = require('./fileManager');
const saveTaskList = fileHandring.saveTaskList;
const taskList = fileHandring.taskList;
const updateTask = fileHandring.updateTask;
const findTaskById = fileHandring.findTaskById;
const checkFileExists = fileHandring.checkFileExists;

// タスクを登録
function register(task) {
  const id = uuid.v1();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);
  const isCompleted = false;
  // タスクのオブジェクト
  const newTask = { id: id, task: task, createdAt: createdAt, isCompleted: isCompleted };
  // JSONファイルの確認
  checkFileExists();
  const tasks = taskList();

  tasks.push(newTask);
  saveTaskList(tasks);
  console.log(chalk.default.green(`タスクを追加しました。`));
};

// タスクの一覧表示
function list() {
  // JSONファイルの確認
  checkFileExists();
  const tasks = taskList();
    if(tasks.length === 0){
    console.log((`タスクがありません。`));
    return;
  }
  tasks.forEach(task => {
    if (task.isCompleted) {
      console.log(chalk.default.gray(`ID;${task.id} \nタスク;${task.task} \n作成日;(${task.createdAt})\n完了状態;完了\n`));
      return;
    }
    console.log(chalk.default.white(`ID;${task.id} \nタスク;${task.task} \n作成日;(${task.createdAt})\n完了状態;未完了\n`));
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
  const tasks = taskList();
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, isCompleted: true };
    }
    return task;
  });
  saveTaskList(updatedTasks);
  console.log(chalk.default.green(`タスクを完了しました。`));
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
  updateTask(taskId);
  console.log(chalk.default.yellow(`タスクを削除しました。`));
}

module.exports = {
  register,
  list,
  done,
  deleteTask
};