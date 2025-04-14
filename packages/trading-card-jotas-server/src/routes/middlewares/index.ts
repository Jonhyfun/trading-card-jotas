import { getSocket, type ConnectedSocket } from "@/states/socket";
import type { Request, Response } from "express";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

export function withAuthorization<T>(
  req: Request,
  res: Response,
  callback: (user: DecodedIdToken, socket: ConnectedSocket) => T
): Promise<T> {
  const token = (req.headers["authorization"] as string).split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Please input a valid authorization token.",
    }) as unknown as Promise<T>;
  }

  return getAuth()
    .verifyIdToken(token)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: true,
          message: "Token doesnt correspond to any user.",
        }) as unknown as Promise<T>;
      }

      const socket = getSocket(user.uid);
      if (!socket) {
        return res.status(401).json({
          error: true,
          message: "User is not connected to game server.",
        }) as unknown as Promise<T>;
      }

      return callback(user, socket);
    });
}
