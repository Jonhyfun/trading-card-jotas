import type { Player } from "@/models/player";

export interface RoomPlayer {
  uid: string;
  player: Player;
  room: string;
}

export type ConnectedSocket = WebSocket & RoomPlayer;

type SocketsType = Record<string, ConnectedSocket>;
let sockets: SocketsType = {};

export const deleteSocket = (room: string) => {
  delete sockets[room];
};

export const setSockets = (setter: (current: SocketsType) => SocketsType) => {
  sockets = setter(sockets);
};

export const getSocket = (uid: string) => sockets[uid];
