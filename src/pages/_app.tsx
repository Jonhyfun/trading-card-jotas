import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Palette, hexToRgb, pixelBorder } from "@/utils/any";
import { ToastContainer } from 'react-toastify';
import { Press_Start_2P } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { Loading } from "@/components/Loading";
import { QueryClient, QueryClientProvider } from 'react-query'
import { useCardsLoad } from "@/hooks/useCards";

const queryClient = new QueryClient()

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ['400'] });

function AppContent({Component, loading, pageProps} : {loading: boolean} & AppProps) {
  useCardsLoad();
  
  return (
    <>
      {loading ? <Layout><Loading/></Layout> : <Component {...pageProps} />}
      <ToastContainer
        bodyStyle={{height: '4rem', margin: 0}}
        toastStyle={{...pixelBorder(hexToRgb(Palette['gray-light'])!), boxShadow: `inset black 0px 0px 0px 4px, black 0px 0px 0px 4px`}}
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

export default function App(appProps : AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);
      const handleComplete = (url: string) => (url === router.asPath) && setLoading(false);

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)

      return () => {
          router.events.off('routeChangeStart', handleStart)
          router.events.off('routeChangeComplete', handleComplete)
          router.events.off('routeChangeError', handleComplete)
      }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AppContent loading={loading} {...appProps} />
      </RecoilRoot>
    </QueryClientProvider>
  )
}
