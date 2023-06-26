"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = exports.getJSONFileNames = exports.parseCsv = exports.sendResponse = void 0;
const fs = require("fs");
const url = require("url");
const path = require("path");
const worker_threads_1 = require("worker_threads");
const const_1 = require("./const");
function csvParser(dirName) {
    return new Promise((resolve, reject) => {
        if (!dirName) {
            reject("Please write directory name!");
        }
        const fromDirPath = path.join(__dirname, dirName);
        if (!fs.existsSync(fromDirPath)) {
            reject(`${dirName} path is not exist`);
        }
        const filesList = fs.readdirSync(fromDirPath);
        const csvFileArr = filesList.filter((file) => path.extname(file) === ".csv");
        if (csvFileArr.length === 0) {
            reject(`There is no .csv file in ${dirName} directory!`);
        }
        const csvFilesCount = csvFileArr.length;
        const results = [];
        const workers = new Map();
        for (let i = 0; i < csvFilesCount; i++) {
            let worker;
            if (csvFilesCount > const_1.MAX_WORKERS_COUNT) {
                const workerNum = getWorkerNum(i, const_1.MAX_WORKERS_COUNT);
                if (i >= const_1.MAX_WORKERS_COUNT && workers.has(workerNum)) {
                    worker = workers.get(workerNum);
                }
                else {
                    const processPath = path.join(__dirname, "processCsv.js");
                    worker = new worker_threads_1.Worker(processPath);
                    workers.set(workerNum, worker);
                }
            }
            else {
                const processPath = path.join(__dirname, "processCsv.js");
                worker = new worker_threads_1.Worker(processPath);
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
function sendResponse(res, code, data) {
    const type = typeof data === 'string' ? 'text/plain' : 'application/json';
    res.writeHead(code, { 'Content-Type': type });
    res.end(JSON.stringify(data));
}
exports.sendResponse = sendResponse;
function parseCsv(req, res) {
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
exports.parseCsv = parseCsv;
function getJSONFileNames(req, res) {
    const dirPath = path.join(__dirname, 'converted');
    if (!fs.existsSync(dirPath)) {
        sendResponse(res, 400, { message: `Directory is not exist` });
    }
    const jsonFilesArr = fs.readdirSync(dirPath);
    sendResponse(res, 200, jsonFilesArr);
}
exports.getJSONFileNames = getJSONFileNames;
function getFile(req, res) {
    const parsedUrl = url.parse(req.url);
    const jsonFileName = path.basename(parsedUrl.pathname);
    const jsonFilePath = path.join(__dirname, 'converted', jsonFileName);
    if (!fs.existsSync(jsonFilePath)) {
        sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
    }
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            sendResponse(res, 400, { message: `Error reading file: ${err}` });
        }
        sendResponse(res, 200, JSON.parse(data));
    });
}
exports.getFile = getFile;
function deleteFile(req, res) {
    const parsedUrl = url.parse(req.url);
    const jsonFileName = path.basename(parsedUrl.pathname);
    const jsonFilePath = path.join(__dirname, 'converted', jsonFileName);
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
exports.deleteFile = deleteFile;
