import * as Events from "@/wsEvents";
import http from "http";
import https from "https";
import { readFileSync } from "fs";
import WebSocket, { WebSocketServer } from "ws";

import type { Express } from "express";
import { type ConnectedSocket, setSockets } from "@/states/socket";
import { isDev } from "../utils/meta";
import { getAuth } from "firebase-admin/auth";
import { Player } from "@/models/player";

export function InitializeWebSocket(app: Express) {
  const devMode = isDev();
  const server = (devMode ? http : https).createServer(
    {
      key: devMode ? undefined : readFileSync("privkey.pem"),
      cert: devMode ? undefined : readFileSync("fullchain.pem"),
    },
    app
  );

  const wss = new WebSocketServer({ server, maxPayload: 2 * 1024 }); //2kb

  wss.on("connection", (ws: ConnectedSocket) => {
    if (!ws.protocol || ws.protocol.length < 100) return ws.close();

    ws.sendEvent = (event, data) => {
      ws.send(`${event}/${JSON.stringify(data)}`);
    };

    getAuth()
      .verifyIdToken(ws.protocol)
      .then((decodedToken) => {
        ws.uid = decodedToken.uid;
        ws.player = new Player(ws);

        setSockets((current) => ({ ...current, [ws.uid]: ws }));
        console.log(`${ws.uid} connected!`);

        ws.on("message", (data) => {
          const [key, ...value] = data.toString().split("/");
          const message = Events[key as keyof typeof Events];

          if (message) {
            message(ws, value as unknown);
          }
        });
      })
      .catch(() => {
        ws.close();
      });
  });

  server.listen(446);

  console.log(
    "\x1b[36m%s\x1b[0m",
    `websocket running on ws${isDev() ? "" : "s"}://localhost:446`
  );

  return wss;
}
