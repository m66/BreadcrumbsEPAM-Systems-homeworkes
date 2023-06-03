import fs from "fs";
import path from "path";
import { Transform } from "stream";

export function transformToUppercase() {
  return new Transform({
    transform(chunk, enc, callback) {
      const uppercase = chunk.toString().toUpperCase();
      callback(null, uppercase);
    },
  });
}

export function transformToLowercase() {
  return new Transform({
    transform(chunk, enc, callback) {
      const uppercase = chunk.toString().toLowerCase();
      callback(null, uppercase);
    },
  });
}

export function transformToReverse() {
  return new Transform({
    transform(chunk, enc, callback) {
      const uppercase = chunk
        .toString()
        .split("\n")
        .map((line) => {
          return line.split("").reverse().join("");
        })
        .join("");
      callback(null, uppercase);
    },
  });
}

export function isExistOperation(op) {
  const operations = ["uppercase", "lowercase", "reverse"];

  if (!operations.includes(op)) {
    throw new Error(`[${op}] operation does not exist!`);
  }

  return true;
}

export function isExistFiles(inputFile, outputFile) {
  const inputFilePath = path.join(process.cwd(), inputFile);
  const outputFilePath = path.join(process.cwd(), outputFile);

  if (!fs.existsSync(inputFilePath)) {
    throw new Error(`[${inputFile}] file does not exist!`);
  }

  if (!fs.existsSync(outputFilePath)) {
    fs.writeFileSync(outputFilePath, "");
  }

  return true;
}
