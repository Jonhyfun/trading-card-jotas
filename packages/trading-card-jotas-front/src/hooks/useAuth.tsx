"use client";

import { setToken } from "@/_actions/cookie";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomEffect } from "jotai-effect";

export const userAtom = atom<{
  user?: Pick<User, "email" | "uid"> & { token: string };
  loading: boolean;
}>({ loading: true });

const userAtomEffect = atomEffect((get, set) => {
  const unsubscribe = auth.onIdTokenChanged((user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setToken(token);
        set(userAtom, {
          user: {
            email: user.email,
            uid: user.uid,
            token: token,
          },
          loading: false,
        });
      });
      return;
    }
    setToken(undefined);
    set(userAtom, { user: undefined, loading: false });
  });
  return () => {
    unsubscribe();
  };
});

export const useAuthRegister = () => {
  useAtom(userAtomEffect);
};

export const useAuth = () => useAtomValue(userAtom);
