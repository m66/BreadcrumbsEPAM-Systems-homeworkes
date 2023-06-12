import fs, { createWriteStream } from "fs";
import path from "path";
import { spawn } from "child_process";

const dirName = "logs";
const dirPath = path.join(process.cwd(), dirName);
let fileName = "";

function getProcessStatistics(command, args = [], timeout = Infinity) {
  const startDate = new Date();
  fileName = `${startDate.toISOString().replaceAll(":", "-")}${command}.json`;

  console.log(`${startDate.toISOString()}${command}.json`);

  const statisticsData = {
    start: startDate.toISOString(),
    duration: null,
    success: false,
    commandSuccess: true,
    error: "",
  };

  return new Promise((res, rej) => {
    const childProcess = spawn(command, args);

    childProcess.stdout.on("data", (data) => {});

    childProcess.stderr.on("data", (err) => {
      statisticsData.error = err.message;
    });

    childProcess.on("error", (err) => {
      statisticsData.error = `Child process error: ${err.message}`;
      statisticsData.commandSuccess = false;
    });

    // childProcess.on('exit', (code) => {
    //   if (code === 0) {
    //       statisticsData.commandSuccess = true;
    //   }
    // })

    childProcess.on("close", () => {
      const endDate = +new Date();
      statisticsData.duration = endDate - +startDate;
      statisticsData.success = true;

      if (fs.existsSync(dirPath)) {
        const filePath = path.join(dirPath, fileName);
        fs.writeFileSync(filePath, JSON.stringify(statisticsData, null, 2));
      } else {
        fs.mkdirSync(dirName);
        const filePath = path.join(dirPath, fileName);
        const writeStream = createWriteStream(filePath);
        writeStream.write(JSON.stringify(statisticsData, null, 2));
      }
      res(statisticsData);
    });

    if (timeout !== Infinity) {
      setTimeout(() => {
        startDate.error = `The process was executeed after ${timeout}ms!`
        childProcess.kill();
      }, timeout);
    }
  });
}

const statisticsInfo = getProcessStatistics('arp', ["-a"], 3000);

statisticsInfo
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
