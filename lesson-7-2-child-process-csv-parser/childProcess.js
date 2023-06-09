import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

const dirName = "converted";

process.on("message", (msg) => {
  const filePath = path.join(process.cwd(), msg);
  const parser = parse({ delimiter: "," });

  if (fs.existsSync(filePath)) {
    const fileName = path.parse(filePath).name;
    const convertedFilePath = path.join(
      process.cwd(),
      dirName,
      `${fileName}.json`
    );

    fs.mkdirSync("converted");

    // const csvFileData = fs.readFileSync(filePath);

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(convertedFilePath);

    readStream.pipe(parser).pipe(writeStream);
    // readStream.pipe(parse({ delimiter: "," })).on("data", (data) => {
    //   writeStream.write(JSON.stringify(data));
    // });

    // fs.writeFileSync(convertedFilePath, csvFileData);
  } else {
    console.log(`${filePath} path is not exist`);
  }
});
