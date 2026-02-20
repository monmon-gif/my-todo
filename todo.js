const { program } = require('commander');

const command = require('./commands');
const register = command.register;
const list = command.list;
const done = command.done;
const deleteTask = command.deleteTask;

// タスクの追加command
program.command(`add`)
.argument(`<string>`)
.action((task) => {
  register(task);
});

// タスクの一覧表示command
program.command(`list`)
.action(() => {
  list();
});

// タスクの完了command
program.command(`done`)
.argument(`<string>`)
.action((taskId) => {
  done(taskId);
});

// タスクの削除command
program.command(`delete`)
.argument(`<string>`)
.action((taskId) => {
  deleteTask(taskId);
});

program.parse();