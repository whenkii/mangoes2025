const https = require("https");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./router.js");
const webServerConfig = require("../config/web-server.js");


let httpServer;

var   fs = require("fs");
const credentials = {
                     key:fs.readFileSync("./certs/key.pem"),
                     cert:fs.readFileSync("./certs/cert.pem"),

};

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    const httpServer = https.createServer(credentials, app);

    // web server logging
    app.use(morgan("combined"));
    app.use(cors());

    app.use(
      express.json({
        reviver: reviveJson,
      })
    );

    app.use("/api", router);

    httpServer
      .listen(webServerConfig.port)
      .on("listening", () => {
        console.log(
          `Web server listening on localhost:${webServerConfig.port}`
        );

        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

// previous code above this line

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === "string" && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}
