// フォーマット形成
const chalk = require('chalk');

function formatTask(tasks) {
  // タスクの色分け
  const PRIORITY_COLORS = { high: chalk.default.red, medium: chalk.default.yellow, low: chalk.default.white };
  const getTaskColor = (task) => task.isCompleted ? chalk.default.gray : (PRIORITY_COLORS[task.priority] ?? chalk.default.white);

  // タスクの表示
  const formatTaskDisplay = (task) => {
    const status = task.done ? '完了' : '未完了';
    return `ID:${task.id}\nタスク:${task.title}\n作成日:(${task.created_at})\n完了状態:${status}\n`;
  };
  tasks.forEach((task) => {
    console.log(getTaskColor(task)(formatTaskDisplay(task)));
  });
}

module.exports = {
    formatTask
};