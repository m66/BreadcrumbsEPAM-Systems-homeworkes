import fs from "fs";
import path from "path";
import { Transform } from "stream";

export function transformByOperation(operation) {
  return new Transform({
    transform(chunk, enc, callback) {
      let ts = chunk.toString();

      switch (operation) {
        case "uppercase":
          ts = ts.toUpperCase();
          break;
        case "lowercase":
          ts = ts.toLowerCase();
          break;
        case "reverse":
          ts = ts
            .split("\n")
            .map((line) => line.split("").reverse().join(""))
            .join("");
      }
      callback(null, ts);
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
