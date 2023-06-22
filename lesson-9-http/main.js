import fs from "fs";
import url from "url";
import path from "path";
import { createServer } from "http";

import { getJSONsList, initCsvParser } from "./helpers.js";

const port = process.env.MY_PORT || 3001;

const server = createServer((req, res) => {
  if (req.url === "/exports") {
    if (req.method === "POST") {
      let dirName = "";

      req.on("data", (data) => {
        dirName += data.toString();
      });

      req.on("end", () => {
        const { dirPath } = JSON.parse(dirName);

        initCsvParser(dirPath)
          .then((data) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
          })
          .catch((err) => res.end(JSON.stringify(err)));
      });
    }
  } else if (req.url === "/files") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(JSON.stringify(getJSONsList("converted")));
    }
  } else if (req.url.startsWith("/files/")) {
    const parsedUrl = url.parse(req.url);
    const jsonFileName = path.basename(parsedUrl.pathname);
    const jsonFilePath = path.join(process.cwd(), "converted", jsonFileName);

    if (!fs.existsSync(jsonFilePath)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end({ message: `${jsonFileName} is not exist!` });
    }

    if (req.method === "GET") {
      fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end({ message: `Error reading file from disk: ${err}` });
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      });
    } else if (req.method === "DELETE") {
      fs.unlink(jsonFilePath, (err) => {
        if (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end({ message: `Error occuredon the file creating: ${err.message}` });
        }
        
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`${jsonFileName} deleted successfuly!`);
      });
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end({ message: "Page not found!" });
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
