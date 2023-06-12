import { workerData, parentPort } from "worker_threads";
import csv from "csv-parser";
import path from "path";
import fs from "fs";

const { csvFileName, csvDir } = workerData;
const csvFilePath = path.join(process.cwd(), csvDir, csvFileName);
const jsonFilePath = path.join(
  process.cwd(),
  "converted",
  csvFileName.replace("csv", "json")
);

if (!fs.existsSync("converted")) {
  fs.mkdirSync("converted");
}

const results = [];
const startDate = new Date();

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("error", (err) => {
    parentPort.postMessage({
      message: `Error during conwert: ${err}`,
    });
  })
  .on("end", () => {
    fs.createWriteStream(jsonFilePath).write(JSON.stringify(results, null, 2));
    parentPort.postMessage({
      message: `Converted ${results.length} rows. Duration: ${
        new Date() - startDate
      } ms`,
    });
  });
