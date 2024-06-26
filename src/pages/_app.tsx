import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilCallback } from "recoil";
import { Palette, hexToRgb, pixelBorder } from "@/utils/any";
import { ToastContainer } from 'react-toastify';
import { Press_Start_2P } from "next/font/google";
import { Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { Loading } from "@/components/Loading";
import { QueryClient, QueryClientProvider } from 'react-query'
import { useCardsLoad } from "@/hooks/useCards";
import { useAuthRegister } from "@/hooks/useAuth";
import { websocketAtom } from "@/hooks/useGameSocket";
import { auth } from "@/utils/firebase";

const queryClient = new QueryClient()

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ['400'] });

function AppContent({ Component, loadingState, pageProps, ...otherAppProps }: { loadingState: [boolean, Dispatch<SetStateAction<boolean>>] } & AppProps) {
  const user = useAuthRegister({ Component, pageProps, ...otherAppProps });
  const [loading, setLoading] = loadingState
  const [error, setError] = useState(false)
  useCardsLoad();

  const handleInitialSocket = useRecoilCallback(({ set, snapshot }) => async () => {
    setLoading(true)
    if (!user) return setLoading(false)
    console.log({ user })
    const token = await auth.currentUser!.getIdToken()
    const currentSocket = await snapshot.getPromise(websocketAtom)
    if (currentSocket) currentSocket.close();


    const newSocket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!, token)
    newSocket.onopen = () => setLoading(false)
    newSocket.onerror = () => setError(true)
    newSocket.onclose = newSocket.onerror

    set(websocketAtom, newSocket)
  }, [setLoading, user])

  useEffect(() => {
    handleInitialSocket()
  }, [handleInitialSocket])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        document.getElementById("cadeira")!.style.filter = 'invert(1)'
      }, 1000)
    }
  }, [error])

  return (
    <>
      {error ? (
        <div className="w-screen h-screen bg-bg-internal font-medium text-black flex flex-col gap-2 text-center p-3 justify-center items-center">
          <img id="cadeira" width={200} height={200} className="rotate-[900deg] transition-all duration-1000" src="/cadeira.jpg" />
          <span>Servidor offline ou em manutenção. Tente novamente mais tarde.</span>
        </div>
      ) : (
        <>
          {((loading || typeof user === 'undefined')) ? <Layout><Loading /></Layout> : <Component {...pageProps} />}
        </>
      )}
      <ToastContainer
        bodyStyle={{ height: '4rem', margin: 0 }}
        toastStyle={{ ...pixelBorder(hexToRgb(Palette['gray-light'])!), boxShadow: `inset black 0px 0px 0px 4px, black 0px 0px 0px 4px` }}
        bodyClassName="border-2 border-gray w-full p-0"
        toastClassName={`${pixelFont.className} rounded-none bg-bg-internal text-sm text-black p-0 border-solid border-2 border-white`}
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
    </>
  )
}

export default function App(appProps: AppProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const handleStart = (url: string) => { if (url !== router.asPath) setLoading(true) };
    const handleComplete = (url: string) => { if (url === router.asPath) setLoading(false) };

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.asPath, router.events])

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AppContent loadingState={[loading, setLoading]} {...appProps} />
      </RecoilRoot>
    </QueryClientProvider>
  )
}
