import chalk from "chalk";
import fs from "fs";
import path from "path";

const textContent = "hello world";
const allDirsPath = [];
const deepestDirInfo = {
  path: "",
  deepSize: 0,
};

function getDirectoriesList(dirPaths) {
  dirPaths.forEach((dirPath) => {
    const results = fs.readdirSync(dirPath);

    const dirs = results.filter((i) => {
      const targetPath = path.join(dirPath, i);
      const state = fs.statSync(targetPath);
      return state.isDirectory();
    });

    const nestedDirPaths = dirs.map((dir) => path.resolve(dirPath, dir));
    if (nestedDirPaths.length === 0) {
      return;
    }
    nestedDirPaths.forEach((nestedDir) => allDirsPath.push(nestedDir));
    getDirectoriesList(nestedDirPaths);
  });
}

function getDeepestDirectory(allDirsPath) {
  allDirsPath.forEach((dirPath) => {
    const deepSize = dirPath.split(path.sep);
    if (deepSize.length > deepestDirInfo.deepSize) {
      deepestDirInfo.path = dirPath;
      deepestDirInfo.deepSize = deepSize.length;
    }
  });
}

getDirectoriesList([process.cwd()]);
getDeepestDirectory(allDirsPath);

const createdFilePath = path.join(deepestDirInfo.path, "file.txt");

console.log(deepestDirInfo.path);

fs.writeFileSync(createdFilePath, textContent, (err) => {
  if (err) console.log(chalk.red(err));
  console.log(
    `File created successfully inside of ${chalk.blue(
      `[${deepestDirInfo.path}]`
    )}`
  );
});
