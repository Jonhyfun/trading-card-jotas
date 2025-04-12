"use client";

import Typewriter from "react-ts-typewriter";
import Link from "next/link";
import { pixelBorder } from "@/utils/any";
import { TripleBorder } from "@/components/TripleBorder";
import { Layout } from "@/layout";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { makeId } from "@/utils/any";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/Input";
import { GoogleLoginButton } from "@/components/GoogleButton";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { errorToast } from "@/utils/toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(() => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        //console.log(response)
      })
      .catch((e) => {
        if (e.code === "auth/wrong-password")
          return errorToast("Senha incorreta!");
        if (e.code === "auth/user-not-found")
          return errorToast("Não existe usuário com esse email");
        errorToast("Erro desconhecido, tente novamente mais tarde!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, password]);

  return (
    <div className="flex w-full h-full flex-col gap-3 items-center">
      <span className="pl-2 h-1/6 content-center">
        Faça login para continuar
      </span>
      <TripleBorder borderColor="gray-light" className="w-full h-full">
        <div className="flex flex-col justify-between py-6 px-6 gap-10 h-full w-full">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span>Email:</span>
              <Input
                state={[email, setEmail]}
                type="email"
                className="h-min w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>Senha:</span>
              <Input
                state={[password, setPassword]}
                type="password"
                className="h-min w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center justify-end text-center w-full">
            <button
              disabled={loading}
              onClick={handleLogin}
              style={{
                ...pixelBorder("black"),
                boxShadow: `inset 0 0 0 2px black`,
              }}
              className="px-2 py-0.5 bg-white  disabled:bg-gray disabled:opacity-60 group w-full"
            >
              <span className="group-hover:group-enabled:visible invisible mr-2">
                *
              </span>
              <span className="pr-5">Entrar</span>
            </button>
            <span>ou</span>
            <GoogleLoginButton />
            <Link
              href="/signin"
              className="text-sm text-blue-600 cursor-pointer mt-5 underline"
            >
              Não tem uma conta?
            </Link>
          </div>
        </div>
      </TripleBorder>
    </div>
  );
}

function HomePage() {
  const router = useRouter();
  const { localDeck } = useLocalStorage();

  const createGame = useCallback(() => {
    const game = makeId(5);
    router.push(`/game/${game}`);
  }, [router]);

  return (
    <div className="pt-8 grid grid-rows-3 w-full h-full">
      <Typewriter cursor={false} text="Trading Card Game do Jotas em breve!" />
      <TripleBorder className="row-span-2" borderColor="gray-light">
        <div className="w-full h-full md:p-5 md:pt-7 p-3 pt-5 flex flex-col gap-6 md:text-base text-xs">
          <Link href="/rooms" className="group cursor-pointer">
            <span className="group-hover:visible invisible mr-2">*</span>
            <span>Salas</span>
          </Link>
          <div
            onClick={createGame}
            className={`${
              localDeck && localDeck.length === 20
                ? "group"
                : "cursor-auto opacity-40"
            } cursor-pointer`}
          >
            <span className="group-hover:visible invisible mr-2">*</span>
            <span>Nova Partida</span>
          </div>
          <Link href="/deck" className="group cursor-pointer">
            <div className="group cursor-pointer">
              <span className="group-hover:visible invisible mr-2">*</span>
              <span>Meus Decks</span>
            </div>
          </Link>
          <div onClick={() => signOut(auth)} className="group cursor-pointer">
            <span className="group-hover:visible invisible mr-2">*</span>
            <span>Sair</span>
          </div>
        </div>
      </TripleBorder>
    </div>
  );
}

export default function Home() {
  const user = useAuth();

  return (
    <Layout>
      {!user && <LoginPage />}
      {!!user && <HomePage />}
    </Layout>
  );
}
