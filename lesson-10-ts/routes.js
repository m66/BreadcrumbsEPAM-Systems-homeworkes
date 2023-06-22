import fs from "fs";
import url from "url";
import path from "path";

// import { getJSONsList, initCsvParser, sendResponse } from "./helpers";

export const routes = {
  "/exports": {
    POST: parseCsv,
  },
  // "/files": {
  //   GET: getJSONFileNames,
  // },
  // "/files/:fileName": {
  //   GET: getFile,
  //   DELETE: deleteFile,
  // },
};

function parseCsv(request, response) {
  response.end("hello");
  let dirName = "";

  request.on("data", (data) => {
    dirName += data.toString();
  });

  request.on("end", () => {
    const { dirPath } = JSON.parse(dirName);

    initCsvParser(dirPath)
      .then((data) => {
        sendResponse(response, 200, data);
        // res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(data));
      })
      .catch((err) => sendResponse(response, 400, { message: err }));
    // .catch((err) => res.end(JSON.stringify(err)));
  });
}

// function getJSONFileNames(request, response) {
//   sendResponse(res, 200, getJSONsList("converted"));
// }

// function getFile(request, response) {
//   const parsedUrl = url.parse(request.url);
//   const jsonFileName = path.basename(parsedUrl.pathname);
//   const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

//   if (!fs.existsSync(jsonFilePath)) {
//     sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
//   }

//   fs.readFile(jsonFilePath, "utf8", (err, data) => {
//     if (err) {
//       sendResponse(res, 400, {message: `Error reading file from disk: ${err}`});
//     }

//     sendResponse(res, 200, data);
//   });
// }

// function deleteFile(request, response) {
//   const parsedUrl = url.parse(request.url);
//   const jsonFileName = path.basename(parsedUrl.pathname);
//   const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

//   if (!fs.existsSync(jsonFilePath)) {
//     sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
//   }

//   fs.unlink(jsonFilePath, (err) => {
//     if (err) {
//       sendResponse(res, 400, {
//         message: `Error occuredon the file creating: ${err.message}`,
//       });
//     }

//     sendResponse(res, 200, `${jsonFileName} deleted successfuly!`);
//   });
// }

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

export function initCsvParser(dirName) {
  return new Promise((resolve, reject) => {
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

export function sendResponse(res, code, data) {
  const type = typeof data === "string" ? "text/plain" : "application/json";

  res.writeHead(code, { "Content-Type": type });
  res.end(JSON.stringify(data));
}
