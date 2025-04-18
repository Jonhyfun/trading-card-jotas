"use client";

import type { PropsWithChildren } from "react";
import { Palette, hexToRgb, pixelBorder } from "@/utils";
import { ToastContainer } from "react-toastify";
import { Press_Start_2P } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCardsLoad } from "@/hooks/useCards";
import { useAuthRegister } from "@/hooks/useAuth";
import { useGameSocketRegister } from "@/hooks/useGameSocket";
import { Provider } from "jotai";

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
        style={{ height: "4rem", margin: 0 }}
        toastStyle={{
          ...pixelBorder(hexToRgb(Palette["gray-light"])!),
          boxShadow: `inset black 0px 0px 0px 3px, black 0px 0px 0px 4px`,
        }}
        className="border-0 w-full p-0"
        toastClassName={`${pixelFont.className} flex items-center justify-center rounded-none bg-bg-internal text-sm text-black p-3 border-solid border-2 border-white`}
        position="bottom-center"
        autoClose={3000}
        icon={false}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
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
