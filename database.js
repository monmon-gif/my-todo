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
    db.run(registerTaskSql, [task.id, task.title, task.done ? 1 : 0, task.priority, task.createdAt], function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// 完了状態の更新
const updateTaskDoneSql = `UPDATE tasks SET done = 1 WHERE id = ?`;
function updateTaskDone({ taskId }) {
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
function clearTask({ taskId }) {
  return new Promise((resolve, reject) => {
    db.run(deleteTaskSql, [taskId], function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// 引数で指定された条件でタスクを取得
function getOptionalTasks(options = {}) {
  return new Promise((resolve, reject) => {
    let findTaskIdSql = `SELECT * FROM tasks`;
    const params = [];
    if (options.taskId) {
      findTaskIdSql += ` WHERE id = ?`;
      params.push(options.taskId);
    } else if (options.taskName) {
      findTaskIdSql += ` WHERE title LIKE ?`;
      params.push(`%${options.taskName}%`);
    } else if (options.done) {
      findTaskIdSql += ` WHERE done = 1`;
    } else if (options.todo) {
      findTaskIdSql += ` WHERE done = 0`;
    }
    db.all(findTaskIdSql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

// 引数で指定された条件でタスク数を取得
function countAllTasks(options = {}) {
  return new Promise((resolve, reject) => {
    let countAllTasksSql = `SELECT COUNT(*) FROM tasks`;
    const params = [];
    if (options.done) {
      countAllTasksSql += ` WHERE done = 1`;
    }
    if (options.oneWeekAgo) {
      countAllTasksSql += ` WHERE created_at >= ?`;
      params.push(options.oneWeekAgo);
    }
    db.get(countAllTasksSql, params, (err, row) => {
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
  updateTaskDone,
  clearTask,
  countAllTasks
};