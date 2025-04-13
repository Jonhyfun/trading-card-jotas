"use client";

import type { GameData } from "trading-card-jotas-types";
import { withAtomEffect } from "jotai-effect";
import { atom, useAtom } from "jotai";
import { userAtom } from "../useAuth";

export const websocketAtom = atom<WebSocket>();

const websocketAtomEffect = withAtomEffect(userAtom, (get, set) => {
  console.log("socket effect");
  const user = get(userAtom);
  if (!user) return;

  let newSocket: WebSocket;
  newSocket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!, user.token);
  newSocket.onclose = () => {
    console.log("deu o ruim");
  };
  set(websocketAtom, newSocket);

  return () => {
    console.log("socket unmount");
    if (newSocket) newSocket.close();
    set(websocketAtom, undefined);
  };
});

export const useGameSocketRegister = () => {
  useAtom(websocketAtomEffect);
};

const gameDataAtom = atom<GameData>();

export const useGameSocket = () => {
  //
};
