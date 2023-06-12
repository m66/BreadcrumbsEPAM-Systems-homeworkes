/* V2 - more compliant option - not finished yet */

import path from "path";
import fs from "fs";
import os from "os";
import cluster from "cluster";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

function getDirCsvsToJson(dirPath) {
  return new Promise((res, rej) => {
    const newDirName = "converted";
    const newDirPath = path.join(process.cwd(), newDirName);
    const fromDirPath = path.join(process.cwd(), dirPath);
    const convertedFilePath = "";
    const startDate = Date.now();
    const nCPUs = os.cpus().length;

    if (!fs.existsSync(fromDirPath)) {
      rej(new Error(`${dirPath} path is not exist`));
    }

    const filesList = fs.readdirSync(fromDirPath);

    const csvFileArr = filesList.filter(
      (file) => path.parse(path.join(fromDirPath, file)).ext === ".csv"
    );

    if (csvFileArr.length === 0) {
      rej(new Error(`There is no .csv file in ${dirPath} directory!`));
    }

    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirName);
    }

    const writestream = fs.createWriteStream(process.cwd(), newDirName, `${csvFileArr[0].split('.')[0]}.json`);

    for (let i = 0; i < csvFileArr.length; i++) {
      const csvFileName = array[i];
      csvFilePath = path.join(process.cwd(), newDirName, csvFileName);
      
      const readstream = fs.createReadStream(csvFilePath);
      writestream.pipe(readstream)
    }
  });
}

function parseCsvToJson(dirPath) {
  return new Promise((resolve, reject) => {

    if (isMainThread) {
      const worker = new Worker(__filename, {
        workerData: dirPath
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });

    } else {
      const dirName = workerData;
      getDirCsvsToJson(dirName)
        .then(result => {
          parentPort.postMessage(result);
        })
        .catch(reject);
    }
  });
}

parseCsvToJson("csvDir")
  .then(res => {
    console.log('....');
  })
  .catch(err => {
    console.error('...')
  });

