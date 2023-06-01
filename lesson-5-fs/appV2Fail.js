/*
  don't working
  I will try a little bit late
*/

import fs from "fs";
import path from "path";

const currentPath = process.cwd();
// let currentDeepSize = 0;

function getDeepestDirectory(currentPath, currentDeepSize = 0) {
  const pathData = fs.readdirSync(currentPath);

  let deepestDirectoryData = {
    path: "",
    deepSize: currentDeepSize,
  };

  pathData.forEach((i) => {
    const targetPath = path.join(currentPath, i);
    const state = fs.statSync(targetPath);

    if (state.isDirectory()) {
      // const nestedDeepDir = getDeepestDirectory(
      //   targetPath,
      //   currentDeepSize + 1
      // );

      // if(nestedDeepDir > deepestDirectoryData.deepSize) {
      //     deepestDirectoryData.path = targetPath;
      //     deepestDirectoryData.deepSize = currentDeepSize;
      // }
      console.log(nestedDeepDir);
      // if(deepestDirectoryData.deepSize < targetPath.split("/\\"))
      // return getDeepestDirectory(targetPath, currentDeepSize+1);
    }
  });

  // return deepestDirectoryData.path;
  // return getDeepestDirectory(
      //   targetPath,
      //   currentDeepSize + 1
      // );;
}

console.log(getDeepestDirectory(currentPath));
