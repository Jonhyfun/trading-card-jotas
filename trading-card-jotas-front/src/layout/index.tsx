"use client";

import { Press_Start_2P } from "next/font/google";
import { hexToRgb, pixelBorder, toggleCRT, Palette } from "@/utils/any";
import { CSSProperties, PropsWithChildren, useMemo, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { CheckeredPatternIcon } from "@/icons/CheckeredPatternIcon";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ["400"] });

export const useCRT = () => {
  //TODO localstorage
  const [crtActivated, setCrtActivated] = useState(false);
  return useMemo(
    () => (
      <div
        onClick={() => toggleCRT(setCrtActivated)}
        style={pixelBorder("black", 1)}
        className="fixed cursor-pointer w-12 h-12 right-3 bottom-2 bg-white rounded-[0.438rem] p-0.5"
      >
        <div className="border-black border-2 w-full h-full flex items-center justify-center">
          {crtActivated ? (
            <div className="w-5/6 h-5/6 bg-black" />
          ) : (
            <CheckeredPatternIcon />
          )}
        </div>
      </div>
    ),
    [crtActivated]
  );
};

export function Layout({
  children,
  style,
}: PropsWithChildren<{ style?: CSSProperties }>) {
  const crtButton = useCRT();
  const { Modal } = useModal();

  return (
    <main
      className={`h-screen w-screen ${pixelFont.className} bg-bg-external flex items-center justify-center p-8`}
    >
      <div
        style={{
          ...pixelBorder("black", 1),
          boxShadow: "3px 3px 8px 2px #00000040",
        }}
        className="w-full h-full md:max-w-[40rem] md:max-h-[40rem] max-h-[36rem] rounded-[0.625rem]"
      >
        <div className="bg-black w-full h-full">
          <div className="w-full h-full bg-black rounded-[0.625rem]">
            <div
              style={{
                ...pixelBorder(hexToRgb(Palette["primary"])!, 1),
                boxShadow: `inset 0 0 0 20px ${Palette["bg-internal"]}`,
              }}
              className="w-full h-full bg-black p-0.5 rounded-[0.375]"
            >
              <div className="w-full h-full border-2 border-primary-light bg-bg-internal">
                <div
                  style={style}
                  className="w-full h-full border-2 border-black bg-bg-internal p-3"
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Modal}
      {crtButton}
    </main>
  );
}
