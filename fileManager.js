// tasks.jsonの読み書き
const fs = require('fs');
const tasks = `tasks.json`;

// タスクの保存
function saveTaskList(taskList) {
  try {
    const toJSON = JSON.stringify(taskList, null, 2);
    fs.writeFileSync(tasks, toJSON, `utf-8`);
    return true;
  } catch (error) {
    return false;
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

// タスクの特定ID検索
function findTaskById(taskId) {
  const tasks = getTaskList();
  const task = tasks.find(task => task.id === taskId);
  return task;
}

// タスクの削除
function clearTask(taskId) {
  const tasks = getTaskList();
  const task = tasks.filter(task => task.id !== taskId);
  saveTaskList(task);
}

module.exports = {
  saveTaskList,
  clearTask,
  findTaskById,
  checkFileExists,
  getTaskList
};