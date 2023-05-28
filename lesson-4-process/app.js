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
} from "./functions.mjs";

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
};

process.stdout.write(`Welcome ${username}!\n`);

process.stdin.on("data", (data) => {
  const cmd = data.toString().trim();

  if (cmd === ".exit") {
    exit();
  } else if (commands[cmd]) {
    process.stdout.write(commands[cmd]() + "\n");
  } else {
    process.stdout.write("\nInvalid input\n");
  }
});

process.on("SIGINT", function () {
  exit();
});