import os from "os";
import {
  exit,
  getCPUsInfo,
  getHomeDir,
  getUsername,
  getArchitecture,
  getHostname,
  getPlatform,
  getMemory,
  helpCommandes,
  getDirectoryItems,
  addNewFile,
  renameFile,
  copyFile,
  moveFile,
  removeFile
} from "./functions.mjs";
import chalk from "chalk";

const { username } = os.userInfo();
// const { pid } = process;  // Version 2 - for stoping process

const commands = {
  "os --cpus": getCPUsInfo,
  "os --homedir": getHomeDir,
  "os --username": getUsername,
  "os --architecture": getArchitecture,
  "os --hostname": getHostname,
  "os --platform": getPlatform,
  "os --memory": getMemory,
  "--help": helpCommandes,
  "ls": getDirectoryItems,
  "add": addNewFile,
  "rn": renameFile,
  "cp": copyFile,
  "mv": moveFile,
  "rm": removeFile
};

process.stdout.write(`Welcome ${username}!\n`);
process.stdout.write(`${chalk.bold("--help")} to see the commands\n`);

process.stdin.on("data", (data) => {
  const cmd = data.toString().trim();
  const [command, ...files] = cmd.split(" ");

  if (cmd === ".exit") {
    exit();
  } else if (commands[cmd]) {
    process.stdout.write(commands[cmd]() + "\n");
  } else if (command) {
    process.stdout.write(commands[command](files) + "\n");
  } else {
    process.stdout.write(chalk.red("Invalid input\n"));
  }
});

process.on("SIGINT", function () {
  exit();
});
