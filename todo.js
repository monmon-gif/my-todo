const { program } = require('commander');

const command = require('./commands');
const { register, list, done, deleteTask, partialMatch, statisticsDisplay } = command;

// タスクの追加command
program.command(`add`)
.argument(`<task name>`)
.option(`--priority <priority>`)
.action((task, options) => {
  register(task, options.priority);
});

// タスクの一覧表示command
program.command(`list`)
.option(`--done`)
.option(`--todo`)
.action((options) => {
  list(options);
});

// タスクの完了command
program.command(`done`)
.argument(`<task id>`)
.action((taskId) => {
  done(taskId);
});

// タスクの削除command
program.command(`delete`)
.argument(`<task id>`)
.action((taskId) => {
  deleteTask(taskId);
});

// タスク名の部分一致検索command
program.command(`search`)
.argument(`<task name>`)
.action((taskName) => {
  // 部分一致検索
  partialMatch(taskName);
});

// タスクの統計表示command
program.command(`status`)
.action(() => {
  statisticsDisplay();
});

program.parse();