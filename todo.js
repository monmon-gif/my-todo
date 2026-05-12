const { program } = require('commander');

const command = require('./commands');
const { register, list, done, deleteTask, partialMatch, statisticsDisplay } = command;
const { createTable } = require('./database');

function commands() {
  // タスクの追加command
  program.command(`add`)
  .argument(`<task name>`)
  .option(`--priority <priority>`)
  .action(async (task, options) => {
    await register(task, options.priority);
  });

  // タスクの一覧表示command
  program.command(`list`)
  .option(`--done`)
  .option(`--todo`)
  .action(async (options) => {
    await list(options);
  });

  // タスクの完了command
  program.command(`done`)
  .argument(`<task id>`)
  .action(async (taskId) => {
    await done(taskId);
  });

  // タスクの削除command
  program.command(`delete`)
  .argument(`<task id>`)
  .action(async (taskId) => {
    await deleteTask(taskId);
  });

  // タスク名の部分一致検索command
  program.command(`search`)
  .argument(`<task name>`)
  .action(async (taskName) => {
    // 部分一致検索
    await partialMatch(taskName);
  });

  // タスクの統計表示command
  program.command(`stats`)
  .action(async () => {
    await statisticsDisplay();
  });
}

async function main() {
  try {
    // データベースのテーブル作成(テーブルがない時)
    await createTable();
    commands();
    await program.parseAsync(process.argv);
  } catch (err) {
    console.error(err);
    // エラー終了
    process.exit(1);
  }
}

main();