"use client";

import { setToken } from "@/_actions/cookie";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomEffect } from "jotai-effect";

export const userAtom = atom<Pick<User, "email" | "uid"> & { token: string }>();

const userAtomEffect = atomEffect((get, set) => {
  console.log("user effect");
  const unsubscribe = auth.onIdTokenChanged((user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setToken(token);
        set(userAtom, {
          email: user.email,
          uid: user.uid,
          token: token,
        });
      });
      return;
    }
    setToken();
    set(userAtom, undefined);
  });
  return () => {
    console.log("user unmount");
    unsubscribe();
  };
});

export const useAuthRegister = () => {
  useAtom(userAtomEffect);
};

export const useAuth = () => useAtomValue(userAtom);
