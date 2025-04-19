/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type {
  SocketEventData,
  SocketEvents,
} from "trading-card-jotas-types/types";
import { withAtomEffect } from "jotai-effect";
import { atom, useAtom, useAtomValue } from "jotai";
import { userAtom } from "../useAuth";
import { useCallback, useEffect } from "react";

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
      console.log({ stringifiedData, key });
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

const latestMessageAtom = atom<{
  key: SocketEvents;
  data: SocketEventData<SocketEvents>;
}>();

export const useGameSocket = () => {
  const latestMessage = useAtomValue(latestMessageAtom); //TODO parse messages and stuff

  const getLatestMessageData = useCallback(
    <T extends SocketEvents>(_key: T): SocketEventData<T> => {
      return latestMessage!.data as SocketEventData<T>;
    },
    [latestMessage]
  );

  useEffect(() => {
    if (latestMessage) {
      if (latestMessage.key === "redirect") {
        const { path } = getLatestMessageData(latestMessage.key);
      } else if (latestMessage.key === "error") {
        const { message, redirectPath } = getLatestMessageData(
          latestMessage.key
        );
      } else if (latestMessage.key === "matchStatus") {
        const { message, status } = getLatestMessageData(latestMessage.key);
        //TODO state
      } else if (latestMessage.key === "syncData") {
        const gameData = getLatestMessageData(latestMessage.key);
        //TODO state
      }
    }
  }, [getLatestMessageData, latestMessage]);
};
