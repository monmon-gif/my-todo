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
// デフォルト引数を使うことで、引数がある場合とない場合で関数を分けなくてもいい。（可読性）
function getTaskList(options = {}) {
  try {
    const data = fs.readFileSync(tasks, `utf-8`);
    const taskList = JSON.parse(data);
    if (options.done) {
      // 完了タスクのみ
      return taskList.filter(task => task.isCompleted);
    } else if (options.todo) {
      // 未完了タスク
      return taskList.filter(task => !task.isCompleted);
    }
  // 全タスク
  return taskList;
  } catch (error) {
    // ファイルの形式が違う場合、[]を返す
    return [];
  }
}

module.exports = {
  saveTaskList,
  getTaskList
};