import fs from "fs";
import url from "url";
import path from "path";
import { createServer } from "http";

import { routes } from "./routes.js";
import { getJSONsList, initCsvParser, sendResponse } from "./helpers.js";

const port = process.env.MY_PORT || 3001;

const server = createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const { method } = req;

  const route = routes[pathname];
  const controller = route && route[method];

  if (controller) {
    controller(req, res);
    
  }
  // if (req.url === "/exports") {
  //   if (req.method === "POST") {
  //     let dirName = "";

  //     req.on("data", (data) => {
  //       dirName += data.toString();
  //     });

  //     req.on("end", () => {
  //       const { dirPath } = JSON.parse(dirName);

  //       initCsvParser(dirPath)
  //         .then((data) => {
  //           sendResponse(res, 200, data);
  //         })
  //         .catch((err) => sendResponse(res, 400, { message: err }));
  //     });
  //   }
  // } 
  else if (req.url === "/files") {
    if (req.method === "GET") {
      sendResponse(res, 200, getJSONsList("converted"));
    }
  } else if (req.url.startsWith("/files/")) {
    const parsedUrl = url.parse(req.url);
    const jsonFileName = path.basename(parsedUrl.pathname);
    const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

    if (!fs.existsSync(jsonFilePath)) {
      sendResponse(res, 400, { message: `${jsonFileName} is not exist!` });
    }

    if (req.method === "GET") {
      fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
          sendResponse(res, 400, {message: `Error reading file from disk: ${err}`});
        }

        sendResponse(res, 200, data);
      });
    } else if (req.method === "DELETE") {
      fs.unlink(jsonFilePath, (err) => {
        if (err) {
          sendResponse(res, 400, {
            message: `Error occuredon the file creating: ${err.message}`,
          });
        }

        sendResponse(res, 200, `${jsonFileName} deleted successfuly!`);
      });
    }
  } else {
    sendResponse(res, 404, { message: "Page not found!" });
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
