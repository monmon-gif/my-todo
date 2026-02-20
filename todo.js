const { program } = require('commander');
const dayjs  = require('dayjs');
const chalk = require('chalk');
const uuid  = require('uuid');
const fs = require('fs');
const taskListPath = `taskList.json`;

program.command(`add`)
.argument(`<string>`)
.action((task) => {
  register(task);
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
  console.log(chalk.default.green('タスクを追加しました。'));
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