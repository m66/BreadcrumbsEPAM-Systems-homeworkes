import { parentPort } from "worker_threads";
import * as csv from "csv-parser";
import * as path from "path";
import * as fs from "fs";

parentPort?.on("message", (message) => {
  const { csvFileName, dirName } = message;  

  const csvFilePath = path.join(__dirname, dirName, csvFileName);

  const jsonFilePath = path.join(
    __dirname,
    "converted",
    csvFileName.replace("csv", "json")
  );

  if (!fs.existsSync("dist/converted")) {
    fs.mkdirSync("dist/converted");
  }

  const results: any = [];
  const startDate = new Date();

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("error", (err) => {
      parentPort?.postMessage({
        message: `An error occurred during converting: ${err}`,
      });
    })
    .on("end", () => {
      fs.createWriteStream(jsonFilePath).write(
        JSON.stringify(results, null, 2)
      );
      parentPort?.postMessage({
        message: `${csvFileName} file converted ${
          results.length
        } rows. Duration: ${new Date().getTime() - startDate.getTime()} ms`,
      });
    });
});
