import {  deleteFile, getFile, getJSONFileNames, parseCsv  } from "./functions";
import { IncomingMessage, ServerResponse } from 'http';

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

export const routes: Record<string, Record<string, RouteHandler>> = {
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
