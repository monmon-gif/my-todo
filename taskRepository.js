const dayjs = require('dayjs');

const fileHandling = require('./fileManager');
const { saveTaskList, getTaskList } = fileHandling;

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
  clearTask,
  findTaskById,
  partialMatchList,
  getCompletedTasks,
  getWeekTaskList
};