// tasks.jsonの読み書き
const dayjs = require('dayjs');
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

// jsonファイルの存在確認
function checkFileExists() {
  if (!fs.existsSync(tasks)) {
    const toJSON = JSON.stringify([]);
    fs.writeFileSync(tasks, toJSON, 'utf-8');
  }
}

// タスクの特定ID検索
function findTaskById(taskId) {
  const tasks = getTaskList();
  const task = tasks.find(task => task.id === taskId);
  return task;
}

// タスク名の部分一致検索
function partialMatchList(taskName) {
  const tasks = getTaskList();
  // タスク名が部分一致しているタスクを取得
  const partialMatchTasks = tasks.filter(taskList => {
    const taskTitle = taskList.task;
    return taskTitle.includes(taskName);
  });
  return partialMatchTasks;
}

// タスクの削除
function clearTask(taskId) {
  const tasks = getTaskList();
  const task = tasks.filter(task => task.id !== taskId);
  saveTaskList(task);
}

// 完了タスクの取得
function getCompletedTasks(tasks) {
  const completedTasks = tasks.filter(task => task.isCompleted);
  return completedTasks.length;
}

// 1週間のタスクの取得
function getWeekTaskList() {
  const tasks = getTaskList();
  const oneWeekAgo = dayjs().subtract(7, 'day');
  const weekTasks = tasks.filter(task => !dayjs(task.createdAt).isBefore(oneWeekAgo));
  return weekTasks;
};

module.exports = {
  saveTaskList,
  clearTask,
  findTaskById,
  checkFileExists,
  getTaskList,
  partialMatchList,
  getCompletedTasks,
  getWeekTaskList
};