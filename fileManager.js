// tasks.jsonの読み書き
const fs = require('fs');
const taskListPath = `taskList.json`;

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

// タスクの特定ID検索
function findTaskById(taskId) {
  const tasks = taskList();
  const task = tasks.find(task => task.id === taskId);
  return task;
}

// タスクの削除
function updateTask(taskId) {
  const tasks = taskList();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  saveTaskList(updatedTasks);
}

module.exports = {
  saveTaskList,
  getTaskList,
  taskList,
  updateTask,
  findTaskById
};