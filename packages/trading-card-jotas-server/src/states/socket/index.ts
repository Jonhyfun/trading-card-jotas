import WebSocket from "ws";
import type { Player } from "@/models/player";
import type {
  SocketEventData,
  SocketEvents,
} from "trading-card-jotas-types/types";

export interface RoomPlayer {
  uid: string;
  player: Player;
  room: string;
}

export interface ConnectedSocket extends WebSocket, RoomPlayer {
  //
  sendEvent: <T extends SocketEvents>(
    event: T,
    data: SocketEventData<T>
  ) => void;
}

type SocketsType = Record<string, ConnectedSocket>;
let sockets: SocketsType = {};

export const deleteSocket = (room: string) => {
  delete sockets[room];
};

export const setSockets = (setter: (current: SocketsType) => SocketsType) => {
  sockets = setter(sockets);
};

export const getSocket = (uid: string) => sockets[uid];
