/* eslint-disable @typescript-eslint/no-explicit-any */
import * as routes from "./routes";
import * as CardsObject from "../../trading-card-jotas-types/cards"; //TODO watch the folder to update in real time?
import admin from "firebase-admin";
import { InitializeExpress } from "./initializers/express";
import { InitializeWebSocket } from "./initializers/webSocket";
import { isDev } from "./utils/meta";
import { RouteFunction } from "./routes/types";
import type { Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://biggiscript.firebaseio.com",
});

(async () => {
  const express = InitializeExpress();
  InitializeWebSocket(express);

  Object.values(routes).forEach((_routeHandler) => {
    const routeHandler = _routeHandler as RouteFunction;
    if (!routeHandler.route) {
      console.log();
      return console.warn(
        `\x1b[33m${routeHandler.name} has been skipped due to not having a route prop!\x1b[0m`
      );
    }

    routeHandler.route.params.forEach((param) => {
      (routeHandler as any).routeName = `${routeHandler.routeName}/:${
        param as string
      }/`;
    });

    const {
      routeName,
      route: { method },
    } = routeHandler;

    express[method]<Request, Response>(`/${routeName}`, async (req, res) => {
      let finished = false;

      const closeResponse = () => {
        finished = true;
      };

      const result = (await routeHandler(req, res, closeResponse)) as any;

      if (!finished) {
        if (!result) return res.status(200).end();
        return res.json(result);
      }

      return result;
    });
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  console.log();
  console.log("-----------------");
  console.log(`| \x1b[33mCards\x1b[0m: ${Object.keys(CardsObject).join(", ")}`);
  console.log("-----------------");

  console.log();
  console.log("-----------------");
  console.log("\x1b[33m%s\x1b[0m", "Available Routes:");

  express._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(
        "\x1b[32m%s\x1b[0m",
        Object.keys(r.route.methods).join(" ").toUpperCase(),
        r.route.path
      );
    }
  });
  console.log("-----------------");

  if (isDev()) {
    console.log("to no dev");
  }
})().catch((e) => {
  console.error(e);
});
