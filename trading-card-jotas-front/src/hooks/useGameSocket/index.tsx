import { atomEffect } from "jotai-effect";
import { atom } from "jotai";
import type { GameData } from "trading-card-jotas-types";

export const websocketAtom = atom<WebSocket>();

export const websocketAtomEffect = atomEffect((get, set) => {
  const newSocket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!, ""); //TODO better way to handle token?
  newSocket.onclose = newSocket.onerror;

  set(websocketAtom, newSocket);
  return () => {
    newSocket.close();
    set(websocketAtom, undefined);
  };
});

const gameDataAtom = atom<GameData>();

export const useGameSocket = () => {
  //
};
