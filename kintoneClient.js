const axios = require('axios');

const { responseError } = require('./ErrorHandling');

const dotenv = require('dotenv');
dotenv.config();
const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

// タスク登録
async function taskRegister(taskContent){
  console.log(taskContent);
  try {
    await axios.post(`${KINTONE_BASE_URL}/k/v1/record.json`, {
    app: KINTONE_APP_ID,
    record: {
      taskId: { value: taskContent.taskId },
      title: { value: taskContent.title },
      done: { value: [] },
      priority: { value: taskContent.priority },
      createdAt: { value: taskContent.createdAt }
    }
  }, {
    headers: {
      'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  return true;
  } catch (error) {
    responseError(error);
    return false;
  }
}

async function taskList(options) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: options.done ? `done in ("完了")` : options.todo ? `done not in ("完了")` : undefined
      }
    });
    return response.data.records;
  } catch (error) {
    responseError(error);
    return [];
  }
}

async function taskIdSearch(taskId) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: `taskId = "${taskId}"`
      }
    });
    return response.data.records;
  } catch (error) {
    responseError(error);
    return [];
  }
}

async function taskDone(recordId) {
  try {
    await axios.put(`${KINTONE_BASE_URL}/k/v1/record.json`, {
      app: KINTONE_APP_ID,
      id: recordId,
      record: {
        done: { value: ["完了"] }
      }
    }, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (error) {
    responseError(error);
    return false;
  }
}

async function taskDelete(recordId) {
  try {
    await axios.delete(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      data: {
        app: KINTONE_APP_ID,
        ids: [recordId]
      }
    });
    return true;
  } catch (error) {
    responseError(error);
    return false;
  }
}

async function taskPartialMatch(title) {
  try {
    const response = await axios.get(`${KINTONE_BASE_URL}/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
      },
      params: {
        app: KINTONE_APP_ID,
        query: `title like "${title}"`
      }
    });
    return response.data.records;
  } catch (error) {
    responseError(error);
    return [];
  }
}

module.exports = {
  taskRegister,
  taskList,
  taskIdSearch,
  taskDone,
  taskDelete,
  taskPartialMatch
};