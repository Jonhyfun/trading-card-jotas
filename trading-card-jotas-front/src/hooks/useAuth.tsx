import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { AppProps } from "next/app";
import { useEffect } from "react";

const userAtom = atom<Pick<User, "email" | "uid"> | null>();

//? appProps é só pra obrigar esse hook a ser usado apenas no _app, mas até que dá pra fazer coisas bem legais com isso
//? Também dava pra transformar isso num componente "provider" que dá throw se tentarem chamar o useAuth sem isso
export const useAuthRegister = (appProps: AppProps) => {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) return setUser(null as any);
      setUser({
        email: authUser.email,
        uid: authUser.uid,
      });
    });
    return () => {
      unsubscribe();
    };
  }, [setUser]);

  return user;
};

export const useAuth = () => useAtomValue(userAtom);
