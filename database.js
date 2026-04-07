const sqlite3 = require("sqlite3").verbose();;
const db = new sqlite3.Database("./todos.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('データベースに接続しました。');
});

// tasksテーブルの作成
function createTable() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    done INTEGER,
    priority TEXT,
    created_at TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  })
};

module.exports = {
  createTable
};