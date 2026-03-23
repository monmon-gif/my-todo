// フォーマット形成
const chalk = require('chalk');

function formatTask(tasks) {
  // タスクの色分け
  const PRIORITY_COLORS = { high: chalk.default.red, medium: chalk.default.yellow, low: chalk.default.white };
  const getTaskColor = (task) => task.isCompleted ? chalk.default.gray : (PRIORITY_COLORS[task.priority] ?? chalk.default.white);

  // タスクの表示
  const formatTask = (task) => {
    const status = task.isCompleted ? '完了' : '未完了';
    const taskColor = getTaskColor(task);
    return console.log(taskColor(`ID:${task.id} \nタスク:${task.task} \n作成日:(${task.createdAt})\n完了状態:${status}\n`));
  };
  tasks.map(task => formatTask(task));
}

module.exports = {
    formatTask
};