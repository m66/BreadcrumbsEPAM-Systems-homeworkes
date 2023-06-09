import fs from "fs";
import path from "path";
import cluster from "cluster";
import os from "os";

const dirName = "converted";
const nCPUs = os.cpus().length;
let filePath = "";

let convertedFilePath = "";

process.stdin.on("data", (data) => {
  filePath = path.join(process.cwd(), data.toString().trim());

  if (fs.existsSync(filePath)) {
    const fileName = path.parse(filePath).name;
    convertedFilePath = path.join(process.cwd(), dirName, `${fileName}.json`);

    if (cluster.isPrimary) {
      for (let i = 0; i < nCPUs; i++) {
        console.log(i);
        cluster.fork();
      }
    } else {
        
      const csvFileData = fs.readFileSync(filePath);
      console.log(csvFileData);
      fs.mkdirSync(dirName);
      fs.writeFileSync(convertedFilePath, csvFileData);
    }
  } else {
    console.log(`${filePath} path is not exist`);
  }
});
