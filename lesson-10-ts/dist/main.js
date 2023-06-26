"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const http_1 = require("http");
const routes_1 = require("./routes");
const functions_1 = require("./functions");
const port = process.env.MY_PORT || 3001;
const server = (0, http_1.createServer)((req, res) => {
    const { pathname } = url.parse(req.url, true);
    const { method } = req;
    const route = req.url.startsWith('/files/')
        ? routes_1.routes['/files/:fileName']
        : routes_1.routes[pathname];
    const controller = route && route[method];
    if (controller) {
        controller(req, res);
    }
    else {
        (0, functions_1.sendResponse)(res, 404, { message: "Page not found!" });
    }
});
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
