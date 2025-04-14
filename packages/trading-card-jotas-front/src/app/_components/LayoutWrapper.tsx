"use client";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { PropsWithChildren } from "react";
import { Palette, hexToRgb, pixelBorder } from "@/utils";
import { ToastContainer } from "react-toastify";
import { Press_Start_2P } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { useCardsLoad } from "@/hooks/useCards";
import { useAuthRegister } from "@/hooks/useAuth";
import { useGameSocketRegister } from "@/hooks/useGameSocket";
import { Provider, useAtom } from "jotai";

const queryClient = new QueryClient();

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ["400"] });

function AppContent({ children }: PropsWithChildren<unknown>) {
  useGameSocketRegister();
  useAuthRegister();
  useCardsLoad(); //?depends on useQuery (thats why there is this AppContent separated)

  return (
    <>
      {children}
      <ToastContainer
        bodyStyle={{ height: "4rem", margin: 0 }}
        toastStyle={{
          ...pixelBorder(hexToRgb(Palette["gray-light"])!),
          boxShadow: `inset black 0px 0px 0px 4px, black 0px 0px 0px 4px`,
        }}
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
  );
}

export function LayoutWrapper({ children }: PropsWithChildren<unknown>) {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <AppContent>{children}</AppContent>
      </QueryClientProvider>
    </Provider>
  );
}
