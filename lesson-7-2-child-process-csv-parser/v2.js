/* V2 - more compliant option - not finished yet */

import path from "path";
import fs from "fs";
import os from "os";
import cluster from "cluster";

function parseCsvToJson(dirPath) {
  return new Promise((res, rej) => {
    const newDirName = "converted";
    const newDirPath = path.join(process.cwd(), newDirName);
    const fullDirPath = path.join(process.cwd(), dirPath);
    const startDate = Date.now();
    const nCPUs = os.cpus().length;

    if (!fs.existsSync(fullDirPath)) {
      rej(new Error(`${dirPath} path is not exist`));
    }

    const filesList = fs.readdirSync(fullDirPath);

    const csvFileArr = filesList.filter(
      (file) => path.parse(path.join(fullDirPath, file)).ext === ".csv"
    );

    if (csvFileArr.length === 0) {
      rej(new Error(`There is no .csv file in ${dirPath} directory!`));
    }

    if (!fs.existsSync(newDirPath)) fs.mkdirSync(newDirName);

    if(cluster.isPrimary) {
      for (let i = 0; i < nCPUs; i++) {
        cluster.fork()        
      }
    } else {
      
    }

    res(csvFileArr);
  });
}

parseCsvToJson("csvDir")
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
