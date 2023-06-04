import { createReadStream, createWriteStream } from "fs";
import chalk from "chalk";

import {
  isExistFiles,
  isExistOperation,
  transformByOperation,
} from "./functions.mjs";

const [inputFile, outputFile, operation] = process.argv.splice(2);

try {
  if (isExistFiles(inputFile, outputFile) && isExistOperation(operation)) {
    const readable = createReadStream(inputFile);
    const writable = createWriteStream(outputFile);

    const transform = transformByOperation(operation);
    readable.pipe(transform).pipe(writable);

    process.stdout.write(
      chalk.magenta(`The <${operation}> transform was successful ;)\n`)
    );
  }
} catch (err) {
  process.stdout.write(chalk.red(err) + "\n");
}
