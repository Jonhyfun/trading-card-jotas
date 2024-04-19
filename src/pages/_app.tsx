import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Palette, hexToRgb, pixelBorder } from "@/utils";
import { ToastContainer } from 'react-toastify';
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ['400'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <ToastContainer
        bodyStyle={{height: '64px', margin: 0}}
        toastStyle={{...pixelBorder(hexToRgb(Palette['gray-light'])!), boxShadow: `inset black 0px 0px 0px 4px, black 0px 0px 0px 4px`}}
        bodyClassName="border-2 border-gray w-full pl-3"
        toastClassName={`${pixelFont.className} rounded-none bg-bg-internal text-sm text-black p-0 border-solid border-2 border-white`}
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
    </RecoilRoot>
  )
}
