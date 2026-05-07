const sqlite3 = require(`sqlite3`).verbose();
const db = new sqlite3.Database(`./todos.db`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
};

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row);
    });
  });
};

// tasksテーブルの作成
function createTable() {
  const createTableSql = `CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT, done INTEGER, priority TEXT, created_at TEXT)`;
  return run(createTableSql);
};

// タスクの登録（非同期の同期化）
function registerTask(task) {
  const registerTaskSql = `INSERT INTO tasks (id, title, done, priority, created_at) VALUES (?, ?, ?, ?, ?)`;
  return run(registerTaskSql, [task.id, task.title, task.done ? 1 : 0, task.priority, task.createdAt]);
}

// 完了状態の更新
function updateTaskDone({ taskId }) {
  const updateTaskDoneSql = `UPDATE tasks SET done = 1 WHERE id = ?`;
  return run(updateTaskDoneSql, [taskId]);
}

// タスクの削除
function deletedTask({ taskId }) {
  const deleteTaskSql = `DELETE FROM tasks WHERE id = ?`;
  return run(deleteTaskSql, [taskId]);
}

// タスクの取得
function findAllTasks() {
  const findAllTasksSql = `SELECT * FROM tasks`;
  return all(findAllTasksSql);
}

// タスクID検索
function findTaskById(taskId) {
  const findTaskIdSql = `SELECT * FROM tasks WHERE id = ?`;
  return get(findTaskIdSql, [taskId]);
}

// タスク名検索
function findTasksByName(taskName) {
  const findTaskNameSql = `SELECT * FROM tasks WHERE title LIKE ?`;
  return all(findTaskNameSql, [`%${taskName}%`]);
}

// タスク完了未完了検索
function findTasksDone(done) {
  const findTasksDoneSql = `SELECT * FROM tasks WHERE done = ?`;
  const val = done ? 1 : 0;
  return all(findTasksDoneSql, [val]);
}

// タスク合計数
async function countAllTasks() {
  const countAllTasksSql = `SELECT COUNT(*) FROM tasks`;
  const count = await get(countAllTasksSql);
  return count[`COUNT(*)`];
}

// タスク完了数
async function countTasksDone() {
  const countTasksDoneSql = `SELECT COUNT(*) FROM tasks WHERE done = 1`;
  const count = await get(countTasksDoneSql);
  return count[`COUNT(*)`];
}

// ７日間タスク数
async function countTasksOneWeekAgo(oneWeekAgo) {
  const countTasksOneWeekAgoSql = `SELECT COUNT(*) FROM tasks WHERE created_at >= ?`;
  const count = await get(countTasksOneWeekAgoSql, [oneWeekAgo]);
  return count[`COUNT(*)`];
}

module.exports = {
  createTable,
  registerTask,
  updateTaskDone,
  deletedTask,
  findAllTasks,
  findTaskById,
  findTasksByName,
  findTasksDone,
  countAllTasks,
  countTasksDone,
  countTasksOneWeekAgo
};