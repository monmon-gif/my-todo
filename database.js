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
const registerTaskSql = db.prepare("INSERT INTO tasks (id, title, done, priority, created_at) VALUES (?, ?, ?, ?, ?)");
// タスクの登録（非同期の同期化）
function registerTask(task) {
  return new Promise((resolve, reject) => {
    registerTaskSql.run(task.id, task.title, task.isCompleted ? 1 : 0, task.priority, task.createdAt, function(err) {
      if (err) {
        return reject(false);
      }
      return resolve(true);
    });
  });
}

// 完了タスク一覧の取得
const getDoneTasksSql = db.prepare("SELECT * FROM tasks WHERE done = 1");
// 未完了タスク一覧の取得
const getTodoTasksSql = db.prepare("SELECT * FROM tasks WHERE done = 0");
// 全タスク一覧の取得
const getAllTasksSql = db.prepare("SELECT * FROM tasks");

// タスクの取得（非同期の同期化）
function getOptionalTasks(options = {}) {
 return new Promise((resolve, reject) => {
  let sql;
  if (options.done) {
    sql = getDoneTasksSql;
  } else if (options.todo) {
    sql = getTodoTasksSql;
  } else {
    sql = getAllTasksSql;
  }
  sql.all((err, rows) => {
    if (err) {
      reject(err);
      return;
    } else {
      return resolve(rows);
    }
  });
 });
}

// タスクIDでタスクを検索
const findTaskIdSql = db.prepare("SELECT * FROM tasks WHERE id = ?");
function findTaskId(taskId) {
  return new Promise((resolve, reject) => {
    findTaskIdSql.get(taskId, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

// 完了状態の更新
const updateTaskDoneSql = db.prepare("UPDATE tasks SET done = 1 WHERE id = ?");
function updateTaskDone(taskId) {
  return new Promise((resolve, reject) => {
    updateTaskDoneSql.run(taskId, function(err) {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}


module.exports = {
  createTable,
  registerTask,
  getOptionalTasks,
  findTaskId,
  updateTaskDone
};