// tasks.jsonの読み書き
const fs = require('fs');
const tasks = `tasks.json`;

// タスクの保存
function saveTaskList(taskList) {
  try {
    const toJSON = JSON.stringify(taskList);
    fs.writeFileSync(tasks, toJSON);
  } catch (error) {
    console.error(`タスクの保存に失敗しました。`);
  }
}

// タスクの一覧取得
function getTaskList() {
  try {
  const data = fs.readFileSync(tasks, `utf-8`);
  return JSON.parse(data); 
  } catch (error) {
    // ファイルの形式が違う場合、[]を返す
    return [];
  }
}

// jsonファイルの存在確認
function checkFileExists() {
  if (!fs.existsSync(tasks)) {
    const toJSON = JSON.stringify([]);
    fs.writeFileSync(tasks, toJSON);
  }
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
  findTaskById,
  checkFileExists
};