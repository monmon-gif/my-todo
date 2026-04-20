const sqlite3 = require(`sqlite3`).verbose();;
const db = new sqlite3.Database(`./todos.db`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

const createTableSql = `CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT, done INTEGER, priority TEXT, created_at TEXT)`;
// tasksテーブルの作成
function createTable() {
  return new Promise((resolve, reject) => {
    db.run(createTableSql, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
};

// タスクの登録
const registerTaskSql = `INSERT INTO tasks (id, title, done, priority, created_at) VALUES (?, ?, ?, ?, ?)`;
// タスクの登録（非同期の同期化）
function registerTask(task) {
  return new Promise((resolve, reject) => {
    db.run(registerTaskSql, [task.id, task.title, task.isCompleted ? 1 : 0, task.priority, task.createdAt], function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// 完了状態の更新
const updateTaskDoneSql = `UPDATE tasks SET done = 1 WHERE id = ?`;
function updateTaskDone(taskId) {
  return new Promise((resolve, reject) => {
    db.run(updateTaskDoneSql, [taskId], function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// タスクの削除
const deleteTaskSql = `DELETE FROM tasks WHERE id = ?`;
function clearTask(taskId) {
  return new Promise((resolve, reject) => {
    db.run(deleteTaskSql, [taskId], function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// 完了タスク一覧の取得
const getDoneTasksSql = `SELECT * FROM tasks WHERE done = 1`;
// 未完了タスク一覧の取得
const getTodoTasksSql = `SELECT * FROM tasks WHERE done = 0`;
// 全タスク一覧の取得
const getAllTasksSql = `SELECT * FROM tasks`;

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
  db.all(sql, (err, rows) => {
    if (err) {
      return reject(err);
    }
    return resolve(rows);
  });
 });
}

// タスクIDでタスクを検索
const findTaskIdSql = `SELECT * FROM tasks WHERE id = ?`;
function findTaskId(taskId) {
  return new Promise((resolve, reject) => {
    db.get(findTaskIdSql, [taskId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

// タスク名の部分一致検索
const partialMatchTasksSql = `SELECT * FROM tasks WHERE title LIKE ?`;
function partialMatchTasks(taskName) {
  return new Promise((resolve, reject) => {
    db.all(partialMatchTasksSql, [`%${taskName}%`], (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

// 全タスク数
const countAllTasksSql = `SELECT COUNT(*) FROM tasks`;
function countAllTasks() {
  return new Promise((resolve, reject) => {
    db.get(countAllTasksSql, (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row[`COUNT(*)`]);
    });
  });
}

// 完了タスク数
const countCompletedTasksSql = `SELECT COUNT(*) FROM tasks WHERE done = 1`;
function countCompletedTasks() {
  return new Promise((resolve, reject) => {
    db.get(countCompletedTasksSql, (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row[`COUNT(*)`]);
    });
  });
}

// 1週間のタスク数
const countOneWeekTasksSql = `SELECT COUNT(*) FROM tasks WHERE created_at >= ?`;
function countOneWeekTasks(oneWeekAgo) {
  return new Promise((resolve, reject) => {
    db.get(countOneWeekTasksSql, [oneWeekAgo], (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row[`COUNT(*)`]);
    });
  });
}

module.exports = {
  createTable,
  registerTask,
  getOptionalTasks,
  findTaskId,
  updateTaskDone,
  clearTask,
  partialMatchTasks,
  countAllTasks,
  countCompletedTasks,
  countOneWeekTasks
};