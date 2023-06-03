import { createReadStream, createWriteStream } from "fs";
import chalk from "chalk";

import {
  isExistFiles,
  isExistOperation,
  transformToLowercase,
  transformToReverse,
  transformToUppercase,
} from "./functions.mjs";

const operations = {
  uppercase: transformToUppercase,
  lowercase: transformToLowercase,
  reverse: transformToReverse,
};

process.stdin.on("data", (data) => {
  const [inputFile, outputFile, operation] = data.toString().trim().split(" ");

  try {
    if (isExistFiles(inputFile, outputFile) && isExistOperation(operation)) {
      const readable = createReadStream(inputFile);
      const writable = createWriteStream(outputFile);

      const transform = operations[operation]();
      readable.pipe(transform).pipe(writable);

      process.stdout.write(chalk.magenta(`The <${operation}> transform was successful ;)\n`));
    }
  } catch (err) {
    process.stdout.write(chalk.red(err) + '\n');
  }
});
