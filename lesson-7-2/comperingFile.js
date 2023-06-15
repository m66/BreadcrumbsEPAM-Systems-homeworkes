import path from "path";
import fs from "fs";
import csv from "csv-parser";

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

    const result = {};
    let resultCount = 0;

    for (let i = 0; i < csvFileArr.length; i++) {
      const csvFilePath = path.join(process.cwd(), dirName, csvFileArr[i]);
      const jsonFilePath = path.join(
        process.cwd(),
        "converted",
        csvFileArr[i].replace("csv", "json")
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
          fs.createWriteStream(jsonFilePath).write(
            JSON.stringify(results, null, 2)
          );
          resolve({
            message: `Converted ${results.length} rows. Duration: ${
              new Date() - startDate
            } ms`,
          });
        });
    }
  });
}

initCsvParser()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
