"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");
worker_threads_1.parentPort?.on("message", (message) => {
    const { csvFileName, dirName } = message;
    const csvFilePath = path.join(__dirname, dirName, csvFileName);
    const jsonFilePath = path.join(__dirname, "converted", csvFileName.replace("csv", "json"));
    if (!fs.existsSync("dist/converted")) {
        fs.mkdirSync("dist/converted");
    }
    const results = [];
    const startDate = new Date();
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("error", (err) => {
        worker_threads_1.parentPort?.postMessage({
            message: `An error occurred during converting: ${err}`,
        });
    })
        .on("end", () => {
        fs.createWriteStream(jsonFilePath).write(JSON.stringify(results, null, 2));
        worker_threads_1.parentPort?.postMessage({
            message: `${csvFileName} file converted ${results.length} rows. Duration: ${new Date().getTime() - startDate.getTime()} ms`,
        });
    });
});
