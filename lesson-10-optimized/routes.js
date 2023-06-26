import { parseCsv, getJSONFileNames, getFile, deleteFile } from "./functions.js";

export const routes = {
  "/exports": {
    POST: parseCsv,
  },
  "/files": {
    GET: getJSONFileNames,
  },
  "/files/:fileName": {
    GET: getFile,
    DELETE: deleteFile,
  },
};
