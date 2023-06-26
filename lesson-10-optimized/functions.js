import fs from "fs";
import url from "url";
import path from "path";
import { Worker } from "worker_threads";

import { MAX_WORKERS_COUNT } from "./const.js";

function csvParser(dirPath) {
  return new Promise((resolve, reject) => {
    const dirName = dirPath;
    if (!dirName) {
      reject("Please write directory name!");
    }

    const fromDirPath = path.join(process.cwd(), dirName);

    if (!fs.existsSync(fromDirPath)) {
      reject(`${dirName} path is not exist`);
    }

    const filesList = fs.readdirSync(fromDirPath);

    const csvFileArr = filesList.filter(
      (file) => path.extname(file) === ".csv"
    );

    if (csvFileArr.length === 0) {
      reject(`There is no .csv file in ${dirName} directory!`);
    }

    const csvFilesCount = csvFileArr.length;
    const results = [];
    const workers = new Map();

    for (let i = 0; i < csvFilesCount; i++) {
      let worker;

      if (csvFilesCount > MAX_WORKERS_COUNT) {
        const workerNum = getWorkerNum(i, MAX_WORKERS_COUNT);

        if (i > MAX_WORKERS_COUNT && workers.has(workerNum)) {
          worker = workers.get(workerNum);
        } else {
          worker = new Worker("./processCsv.js");
          workers.set(workerNum, worker);
        }

      } else {
        worker = new Worker("./processCsv.js");
      }

      worker.postMessage({ csvFileName: csvFileArr[i], dirName });

      worker.on("message", (data) => {
        results.push(data);

        if (results.length === csvFilesCount) {
          resolve(results);
        }
      });

      worker.on("error", (err) => {
        reject(err);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(`Worker stopped with exit code ${code}`);
        }
      });
    }
  });
}

function getWorkerNum(workerIndex, max) {
  return workerIndex >= max ? workerIndex % max : workerIndex;
}

export function sendResponse(res, code, data) {
  const type = typeof data === "string" ? "text/plain" : "application/json";

  res.writeHead(code, { "Content-Type": type });
  res.end(JSON.stringify(data));
}

export function parseCsv(req, res) {
  let dirName = "";

  req.on("data", (data) => {
    dirName += data.toString();
  });

  req.on("end", () => {
    const { dirPath } = JSON.parse(dirName);

    csvParser(dirPath)
      .then((data) => sendResponse(res, 200, data))
      .catch((err) => sendResponse(res, 400, err));
  });
}

export function getJSONFileNames(req, res) {
  const dirPath = path.join(process.cwd(), "converted");

  if (!fs.existsSync(dirPath)) {
    sendResponse(res, 400, { message: `Directory is not exist` });
  }

  const jsonFilesArr = fs.readdirSync(dirPath);

  sendResponse(res, 200, jsonFilesArr);
}

export function getFile(req, res) {
  const parsedUrl = url.parse(req.url);
  const jsonFileName = path.basename(parsedUrl.pathname);
  const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

  if (!fs.existsSync(jsonFilePath)) {
    sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
  }

  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      sendResponse(res, 400, { message: `Error reading file: ${err}` });
    }

    sendResponse(res, 200, JSON.parse(data));
  });
}

export function deleteFile(req, res) {
  const parsedUrl = url.parse(req.url);
  const jsonFileName = path.basename(parsedUrl.pathname);
  const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

  if (!fs.existsSync(jsonFilePath)) {
    sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
  }

  fs.unlink(jsonFilePath, (err) => {
    if (err) {
      sendResponse(res, 400, {
        message: `Error file creating: ${err.message}`,
      });
    }

    sendResponse(res, 200, `${jsonFileName} deleted successfuly!`);
  });
}
