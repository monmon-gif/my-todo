const { program } = require('commander');
const dayjs  = require('dayjs');
const chalk = require('chalk');
const uuid  = require('uuid');
const fs = require('fs');
const taskListPath = `taskList.json`;

// タスクの追加command
program.command(`add`)
.argument(`<string>`)
.action((task) => {
  register(task);
  console.log(chalk.default.green('タスクを追加しました。'));
});

// タスクの一覧表示command
program.command(`list`)
.action(() => {
  const tasks = taskList();
  if(tasks.length === 0){
    console.log((`タスクがありません。`));
    return;
  }
  tasks.forEach(task => {
    if (task.isCompleted) {
      console.log(chalk.default.gray(`ID;${task.id} \nタスク;${task.task} \n作成日;(${task.createdAt})\n`));
      return;
    }
    console.log(chalk.default.white(`ID;${task.id} \nタスク;${task.task} \n作成日;(${task.createdAt})\n`));
  });
});

// タスクの完了command
program.command(`done`)
.argument(`<string>`)
.action((taskId) => {
  if (!taskId){
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
});

// タスクを登録
function register(task) {
  const id = uuid.v1();
  const createdAt = dayjs().format(`YYYY-MM-DD HH:mm`);
  const isCompleted = false;
  // タスクのオブジェクト
  const newTask = { id: id, task: task, createdAt: createdAt, isCompleted: isCompleted };

  const tasks = taskList();

  tasks.push(newTask);
  saveTaskList(tasks);
};

// タスクの保存
function saveTaskList(taskList) {
  const personJSON = JSON.stringify(taskList);
  fs.writeFileSync(taskListPath, personJSON);
}

// タスクの一覧取得
function getTaskList() {
  const data = fs.readFileSync(taskListPath);
  const taskList = JSON.parse(data);
  return taskList;
}

// タスクの配列
function taskList() {
  const tasks = getTaskList();
  const newTaskList = [];
  for (let i = 0; i < tasks.length; i++) {
    newTaskList.push({
      id: tasks[i].id,
      task: tasks[i].task,
      createdAt: tasks[i].createdAt,
      isCompleted: tasks[i].isCompleted
    });
  }
  return newTaskList;
}

program.parse();