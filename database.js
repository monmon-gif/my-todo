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

// タスクの登録
const registerTask = db.prepare("INSERT INTO tasks (id, title, done, priority, created_at) VALUES (?, ?, ?, ?, ?)");
function registerTask(task) {
  registerTask.run(task.id, task.task, task.done ? 1 : 0, task.priority, task.createdAt, (err) => {
    if (err) {
      console.error(err.message);
      return false;
    }
    return true;
  });
}

const getDoneTasks = db.prepare("SELECT * FROM tasks WHERE done = 1");

const getAllTasks = db.prepare("SELECT * FROM tasks");
function getAllTasksTest() {
  getAllTasks.all((err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(rows); 
  });
}

module.exports = {
  createTable,
  registerTask,
  getAllTasksTest
};