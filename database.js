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

const createTableSql = `CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT, done INTEGER, priority TEXT, created_at TEXT)`;
// tasksテーブルの作成
function createTable() {
  return run(createTableSql);
};

// タスクの登録
const registerTaskSql = `INSERT INTO tasks (id, title, done, priority, created_at) VALUES (?, ?, ?, ?, ?)`;
// タスクの登録（非同期の同期化）
function registerTask(task) {
  return run(registerTaskSql, [task.id, task.title, task.done ? 1 : 0, task.priority, task.createdAt]);
}

// 完了状態の更新
const updateTaskDoneSql = `UPDATE tasks SET done = 1 WHERE id = ?`;
function updateTaskDone({ taskId }) {
  return run(updateTaskDoneSql, [taskId]);
}

// タスクの削除
const deleteTaskSql = `DELETE FROM tasks WHERE id = ?`;
function deletedTask({ taskId }) {
  return run(deleteTaskSql, [taskId]);
}

// タスクの取得
const findAllTasksSql = `SELECT * FROM tasks`;
function findAllTasks() {
  return all(findAllTasksSql);
}

// タスクID検索
const findTaskIdSql = `SELECT * FROM tasks WHERE id = ?`;
function findTaskById(taskId) {
  return get(findTaskIdSql, [taskId]);
}

// タスク名検索
const findTaskNameSql = `SELECT * FROM tasks WHERE title LIKE ?`;
function findTasksByName(taskName) {
  return all(findTaskNameSql, [`%${taskName}%`]);
}

// タスク完了未完了検索
const findTasksDoneSql = `SELECT * FROM tasks WHERE done = ?`;
function findTasksDone(done) {
  const val = done ? 1 : 0;
  return all(findTasksDoneSql, [val]);
}

// タスク合計数
const countAllTasksSql = `SELECT COUNT(*) FROM tasks`;
async function countAllTasks() {
  const count = await get(countAllTasksSql);
  return count[`COUNT(*)`];
}

// タスク完了数
const countTasksDoneSql = `SELECT COUNT(*) FROM tasks WHERE done = 1`;
async function countTasksDone() {
  const count = await get(countTasksDoneSql);
  return count[`COUNT(*)`];
}

// ７日間タスク数
const countTasksOneWeekAgoSql = `SELECT COUNT(*) FROM tasks WHERE created_at >= ?`;
async function countTasksOneWeekAgo(oneWeekAgo) {
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