"use client";

import { withAtomEffect } from "jotai-effect";
import { atom, useAtom, useAtomValue } from "jotai";
import { userAtom } from "../useAuth";
import { useEffect } from "react";

export const websocketAtom = atom<WebSocket>();

const websocketAtomEffect = withAtomEffect(userAtom, (get, set) => {
  console.log("socket effect");
  const { user } = get(userAtom);
  if (!user) return;

  const newSocket = new WebSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL!,
    user.token
  );

  newSocket.onmessage = (e) => {
    const messageSplit = (e.data as string).split("/");
    if (messageSplit.length === 2) {
      const [key, stringifiedData] = messageSplit;
      const data = JSON.parse(stringifiedData) as unknown;

      if (data) {
        set(latestMessageAtom, { key, data });
      }
    }
  };

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

const latestMessageAtom = atom<{ key: string; data: unknown }>();

export const useGameSocket = () => {
  const latestMessage = useAtomValue(latestMessageAtom); //TODO parse messages and stuff

  useEffect(() => {
    console.log({ latestMessage });
  }, [latestMessage]);
};
