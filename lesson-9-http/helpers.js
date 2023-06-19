import path from "path";
import fs from "fs";
import { Worker } from "worker_threads";

export function getJSONsList(dirName) {
  const dirPath = path.join(process.cwd(), dirName);

  if (!fs.existsSync(dirPath)) {
    return {
      message: `${dirName} directory is not exist`,
    };
  }

  const dirsArr = fs.readdirSync(dirPath);

  return dirsArr;
}

function getWorkerNum(workerIndex, max) {
  return workerIndex >= max ? workerIndex % max : workerIndex;
}

function createWorker(csvFileArr, csvDir, cb) {
  const worker = new Worker("./processCsv.js", {
    workerData: { csvFileArr, csvDir },
  });

  worker.on("message", (data) => {
    cb(data);
  });

  worker.on("error", (err) => {
    cb(err);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      cb(`Worker stopped with exit code ${code}`);
    }
  });
}

export function initCsvParser(dirPath) {
  return new Promise((resolve, reject) => {
    const dirName = dirPath;
    if (!dirName) {
      reject("Please write directory name!");
      return;
    }

    const fromDirPath = path.join(process.cwd(), dirName);

    if (!fs.existsSync(fromDirPath)) {
      reject(`${dirName} path is not exist`);
      return;
    }

    const filesList = fs.readdirSync(fromDirPath);

    const csvFileArr = filesList.filter(
      (file) => path.extname(file) === ".csv"
    );

    if (csvFileArr.length === 0) {
      reject(`There is no .csv file in ${dirName} directory!`);
      return;
    }

    const MAX_WORKERS_COUNT = 10;
    const csvFileCount = csvFileArr.length;
    const workers = {};
    const results = [];

    if (csvFileCount < MAX_WORKERS_COUNT) {
      for (let i = 0; i < csvFileCount; i++) {
        workers[i] = [csvFileArr[i]];
      }
    } else {
      for (let i = 0; i < csvFileCount; i++) {
        const workerNum = getWorkerNum(i, MAX_WORKERS_COUNT);

        if (workers.hasOwnProperty(workerNum)) {
          workers[workerNum].push(csvFileArr[i]);
        } else {
          workers[workerNum] = [csvFileArr[i]];
        }
      }
    }

    for (let i in workers) {
      createWorker(workers[i], dirName, (msg) => {
        results.push(msg);

        if (results.length === csvFileCount) {
          resolve(results);
        }
      });
    }
  });
}
