import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

const dirName = "converted";

process.on("message", (msg) => {
  const fullDirPath = path.join(process.cwd(), msg);

  if (!fs.existsSync(fullDirPath)) {
    console.log(`${msg} path is not exist`);
  }

  const filesList = fs.readdirSync(fullDirPath);

  const csvFileArr = filesList.filter(
    (file) => path.parse(path.join(fullDirPath, file)).ext === ".csv"
  );

  if (csvFileArr.length === 0) {
    console.log(`There is no .csv file in ${msg} directory!`);
    return;
  }
  
  const filePath = path.join(fullDirPath, csvFileArr[0]);

  const parser = parse({ delimiter: "," });

  if (fs.existsSync(filePath)) {
    const fileName = path.parse(filePath).name;
    const convertedFilePath = path.join(
      process.cwd(),
      dirName,
      `${fileName}.json`
    );

    fs.mkdirSync("converted");

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(convertedFilePath);

    readStream.pipe(parser).pipe(writeStream);
    // readStream.pipe(parse({ delimiter: "," })).on("data", (data) => {
    //   writeStream.write(JSON.stringify(data));
    // });

  } else {
    console.log(`${filePath} path is not exist`);
  }
});
