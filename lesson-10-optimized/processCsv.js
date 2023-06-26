import { parentPort } from "worker_threads";
import csv from "csv-parser";
import path from "path";
import fs from "fs";

parentPort.on("message", (message) => {
  const { csvFileName, dirName } = message;

  const csvFilePath = path.join(process.cwd(), dirName, csvFileName);
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
        message: `An error occurred during converting: ${err}`,
      });
    })
    .on("end", () => {
      fs.createWriteStream(jsonFilePath).write(
        JSON.stringify(results, null, 2)
      );
      parentPort.postMessage({
        message: `${csvFileName} file converted ${
          results.length
        } rows. Duration: ${new Date() - startDate} ms`,
      });
    });
});
