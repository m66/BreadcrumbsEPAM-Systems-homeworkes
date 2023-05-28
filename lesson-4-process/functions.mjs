import chalk from "chalk";
import os from "os";

const { cpus, arch, hostname, platform, totalmem } = os;
const { username } = os.userInfo();

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
