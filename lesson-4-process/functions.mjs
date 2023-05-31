import chalk from "chalk";
import os from "os";
import fs from "fs";
import path from "path";

const { cpus, arch, hostname, platform, totalmem } = os;
const { username } = os.userInfo();

function compare(a, b) {
  if (a.type < b.type) {
    return -1;
  }
  if (a.type > b.type) {
    return 1;
  }
  return 0;
}

export function exit() {
  process.stdout.write(chalk.magenta(`\nThank you ${username}, goodbye! \n`));
  // process.kill(pid);
  process.exit();
}

export function getCPUsInfo() {
  let cpuInfo = `Amount of CPUS: ${cpus().length}`;

  cpus().forEach((cpu, i) => {
    const [model, ghz] = cpu.model.split(" CPU @ ");

    cpuInfo += `\nCPU${i + 1} - Model: ${chalk.green(
      model
    )}, GHz: ${chalk.green(parseFloat(ghz))}`;
  });

  return cpuInfo;
}

export function getHomeDir() {
  return `Current Home directory: ${chalk.green(process.cwd())}`;
}

export function getUsername() {
  return `Username: ${chalk.green(username)}`;
}

export function getArchitecture() {
  return `Architecture: ${chalk.green(arch())}`;
}

export function getHostname() {
  return `Hostname: ${chalk.green(hostname)}`;
}

export function getPlatform() {
  return `Platform: ${chalk.green(platform)}`;
}

export function getMemory() {
  return `Total memory: ${chalk.green(totalmem)} bytes`;
}

export function helpCommandes() {
  return `
    CPU info [${chalk.green("os --cpus")}] 
    get home directory [${chalk.green("os --homedir")}] 
    username [${chalk.green("os --username")}] 
    architecture [${chalk.green("os --architecture")}] 
    hostname [${chalk.green("os --hostname")}] 
    platform [${chalk.green("os --platform")}] 
    memory [${chalk.green("os --memory")}]
    list of all files/folders in current directory [${chalk.green("ls")}]
    add new file [${chalk.green("add new_file_name")}]
    rename file [${chalk.green("rn path_to_file new_filename")}]
    copy file [${chalk.green("cp path_to_file path_to_new_directory")}]
    move file [${chalk.green("mv path_to_file path_to_new_directory")}]
    remove file [${chalk.green("rm path_to_file")}]
  `;
}

export async function getDirectoryItems() {
  const dirsFilesArr = fs.readdirSync(process.cwd());

  const detailsInfoFilesDirs = dirsFilesArr.map((i) => {
    const filePath = path.join(process.cwd(), i);
    const state = fs.statSync(filePath);
    return {
      name: i,
      type: state.isDirectory() ? "directory" : "file",
    };
  });

  const sortedArr = detailsInfoFilesDirs.sort(compare);

  console.table(sortedArr);
}

export function addNewFile([file]) {
  fs.writeFile(file, "", (err) => {
    console.log(err);
  });
}

export function renameFile([filePath, newName]) {
  fs.rename(filePath, newName, () => {
    console.log("\nFile Renamed!\n");
  });
}

/* 
if the file exists, the file's text will be copied into this, 
otherwise will be created dirs and files, and after that copied text 
*/
export function copyFile([file, newPath]) {
  const newDirPath = path.join(process.cwd(), newPath);
  const newFilePath = path.join(newDirPath, file);

  if (fs.existsSync(newFilePath)) {
    fs.copyFile(file, newFilePath, () => {
      console.log("File copied");
    });
  } else {
    fs.mkdir(newDirPath, { recursive: true }, function (err) {
      if (err) return console.log(err);

      fs.writeFile(newFilePath, "", (err) => {
        console.log(err);
        fs.copyFile(file, newFilePath, () => {
          console.log("File copied");
        });
      });
    });
  }
}

/*
if the folder exists, the file will be moved directly into the folder, 
otherwise the folder will be created, a new one will be moved
*/
export function moveFile([file, destinationPath]) {
  const currentFilePath = path.join(process.cwd(), file);
  const newDirPath = path.join(process.cwd(), destinationPath);
  const newFilePath = path.join(newDirPath, file);

  if (fs.existsSync(newDirPath)) {
    fs.rename(currentFilePath, newFilePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully moved the file!");
      }
    });
  } else {
    fs.mkdir(newDirPath, { recursive: true }, function (err) {
      if (err) return console.log(err);

      fs.rename(currentFilePath, newFilePath, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully moved the file!");
        }
      });
    });
  }
}

export function removeFile([file]) {  
  fs.unlink(path.join(process.cwd(), file), (err) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successfully.");
  });
}
