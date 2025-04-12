import { GoogleLoginButton } from "@/components/GoogleButton";
import { Input } from "@/components/Input";
import { pixelBorder } from "@/utils/any";
import { TripleBorder } from "@/components/TripleBorder";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/layout";
import { auth } from "@/utils/firebase";
import { errorToast } from "@/utils/toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const router = useRouter();

  const handleSignIn = useCallback(() => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        //console.log(response)
      })
      .catch((e) => {
        if (e.code === "auth/weak-password")
          return errorToast("Senha minima: 6 caracteres)");
        if (e.code === "auth/invalid-password")
          return errorToast("Senha inválida");
        if (e.code === "auth/invalid-email")
          return errorToast("Email inválido!");
        if (e.code === "auth/email-already-in-use")
          return errorToast("Já existe um usuário com esse email");
        errorToast("Erro desconhecido, tente novamente mais tarde!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, password]);

  //? So é possível por que no app, nem renderiza nada se o user for undefined (então é sempre user, null ou tela de loading)
  useEffect(() => {
    if (user) router.replace("/");
  }, [router, user]);

  return (
    <Layout>
      <div className="flex w-full h-full flex-col gap-3 items-center">
        <span className="pl-2 h-1/6 content-center">
          Crie sua conta para continuar
        </span>
        <TripleBorder borderColor="gray-light" className="w-full h-full">
          <div className="flex flex-col justify-around items-center py-6 px-6 gap-5 h-full w-full">
            <GoogleLoginButton mode="signin" />
            <span>ou</span>
            <div className="flex flex-col gap-3 w-full">
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

            <div className="flex flex-col gap-4 items-center justify-endtext-center w-full">
              <button
                disabled={loading}
                onClick={handleSignIn}
                style={{
                  ...pixelBorder("black"),
                  boxShadow: `inset 0 0 0 2px black`,
                }}
                className="px-2 py-0.5 bg-white disabled:bg-gray disabled:opacity-60 group w-full"
              >
                <span className="group-hover:group-enabled:visible invisible mr-2">
                  *
                </span>
                <span className="pr-5">Criar conta</span>
              </button>
            </div>
          </div>
        </TripleBorder>
      </div>
    </Layout>
  );
}
