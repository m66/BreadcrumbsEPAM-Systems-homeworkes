import path from "path";
import fs from "fs";
import os from "os";
import { Worker } from "worker_threads";

function createWorker(csvFileName, csvDir, cb) {
  const worker = new Worker("./processCsv.js", {
    workerData: { csvFileName, csvDir },
  });
  worker.on("message", (data) => {
    cb(data);
  });
  worker.on("error", (err) => {
    cb({
      message: `${csvFileName} file pars error: ${err}`,
    });
  });
  worker.on("exit", (code) => {
    if (code !== 0) {
      cb({
        message: `Worker stopped with exit code ${code}`,
      });
    }
  });
}

function reqursiveCreateProcess(list, i, csvDir, getIndex, cb) {
  createWorker(list[i], (res) => {
    cb(list[i], res);

    const newIndex = getIndex();

    if (newIndex <= list.length) {
      reqursiveCreateProcess(list, newIndex, csvDir, getIndex, cb);
    }
  });
}

function initCsvParser() {
  return new Promise((resolve, reject) => {
    const dirName = process.argv[2];
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

    const CPULength = os.cpus().length;
    const result = {};
    let resultCount = 0;

    if (csvFileArr.length < CPULength) {
      for (let i = 0; i < csvFileArr.length; i++) {
        createWorker(csvFileArr[i], dirName, (res) => {
          result[csvFileArr[i]] = res;
          resultCount++;

          if (resultCount === csvFileArr.length) {
            resolve(result);
          }
        });
      }
    } else {
      let lastIndex = CPULength - 1;
      for (let i = 0; i < CPULength; i++) {
        reqursiveCreateProcess(
          csvFileArr,
          () => {
            lastIndex++;
            return lastIndex;
          },
          dirName,
          (key, res) => {
            result[csvFileArr[i]] = res;
            resultCount++;

            if (resultCount === csvFileArr.length) {
              resolve(result);
            }
          }
        );
      }
    }
  });
}

initCsvParser()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
