import type { UserData } from "trading-card-jotas-types/cards/types";

export type ConnectedSocket = WebSocket &
  UserData & {
    uid: string;
  };

type SocketsType = Record<string, ConnectedSocket>;
let sockets: SocketsType = {};

export const deleteSocket = (room: string) => {
  delete sockets[room];
};

export const setSockets = (setter: (current: SocketsType) => SocketsType) => {
  sockets = setter(sockets);
};

export const getSocket = (uid: string) => sockets[uid];
