import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import { readFileSync } from "fs";
import { isDev } from "../utils/meta";

export function InitializeExpress() {
  const app = express();

  const devMode = isDev();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.get(
    "/.well-known/acme-challenge/x7azHRAgMEpyyHHIUgj21_0-0NUcqxKOywy-RAvsyAQ",
    (req, res) => {
      //TODO hide this (doesnt matter because it was already validated)
      res
        .send(
          "x7azHRAgMEpyyHHIUgj21_0-0NUcqxKOywy-RAvsyAQ.JdBjlVg4ZbelazlWDsncgBeQtHeDOGkT6JO6-bwjWYs"
        )
        .end();
    }
  );

  (devMode ? http : https)
    .createServer(
      {
        key: devMode ? undefined : readFileSync("privkey.pem"),
        cert: devMode ? undefined : readFileSync("fullchain.pem"),
      },
      app
    )
    .listen(86);

  console.log(
    "\x1b[90m%s\x1b[0m",
    `server running on http${isDev() ? "" : "s"}://localhost:86`
  );

  return app;
}
