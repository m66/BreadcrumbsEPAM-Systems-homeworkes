import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const dirName = "logs";
const dirPath = path.join(process.cwd(), dirName);
let fileName = "";

function getProcessStatistics(command, args = [], timeout = Infinity) {
  const startDate = +new Date();
  fileName = `${startDate}${command}.json`;

  const statisticsData = {
    start: "",
    duration: null,
    success: false,
    commandSuccess: false,
    error: "",
  };

  return new Promise((res, rej) => {
    const childProcess = spawn(command, args);

    childProcess.stdout.on("data", (data) => {});

    childProcess.stderr.on("data", (data) => {
      statisticsData.error = `Error from childe: ${data}`;
    });

    childProcess.on("error", (err) => {
      statisticsData.error = `Error from parent: ${err}`;
    });

    childProcess.on("exit", () => {
      const endDate = +new Date();
      statisticsData.success = true;
      statisticsData.duration = endDate - startDate;

      if (fs.existsSync(dirPath)) {
        const filePath = path.join(dirPath, fileName);
        fs.writeFileSync(filePath, JSON.stringify(statisticsData, null, 2));
      } else {
        fs.mkdirSync(dirName);
        const filePath = path.join(dirPath, fileName);
        fs.writeFileSync(filePath, JSON.stringify(statisticsData, null, 2));
      }
      res(statisticsData);
    });
  });
}

getProcessStatistics("ls", ["-lh", "/usr"])
