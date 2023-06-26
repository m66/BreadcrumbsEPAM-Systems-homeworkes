"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const functions_1 = require("./functions");
exports.routes = {
    "/exports": {
        POST: functions_1.parseCsv,
    },
    "/files": {
        GET: functions_1.getJSONFileNames,
    },
    "/files/:fileName": {
        GET: functions_1.getFile,
        DELETE: functions_1.deleteFile,
    },
};
