import Typewriter from 'react-ts-typewriter';
import { Press_Start_2P } from "next/font/google";
import { hexToRgb, pixelBorder, toggleCRT } from "@/styles/utils";
import { Palette } from "../../tailwind.config";
import { useState } from "react";
import { TripleBorder } from "@/components/TripleBorder";
import Link from 'next/link';

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ['400'] });

export default function Home() {
  const [crtActivated, setCrtActivated] = useState(false);

  return (
    <main
      className={`h-screen w-screen ${pixelFont.className} bg-bg-external flex items-center justify-center p-8`}
    >
      <div
        style={{
          ...pixelBorder('black', 1)
        }}
        className="w-full h-full md:max-w-[40rem] md:max-h-[40rem] max-h-[30rem] max-w-[19rem]"
      >
        <div className="bg-black w-full h-full">
          <div
            className="w-full h-full bg-black rounded-[10px]"
          >
            <div
              style={{
                ...pixelBorder(hexToRgb(Palette['primary'])!, 1)
              }}
              className="w-full h-full bg-bg-internal p-0.5 rounded-[6px]"
            >
              <div
                className="w-full h-full border-2 border-primary-light bg-bg-internal"
                >
                <div className="w-full h-full border-2 border-black bg-bg-internal grid grid-rows-3 p-3">
                  <span className="pt-8">
                    <Typewriter cursor={false} text="Trading Card Game do Jotas em breve!"/>
                  </span>
                  <TripleBorder className="row-span-2" borderColor="gray-light">
                    <div className="w-full h-full md:p-5 md:pt-7 p-3 pt-5 flex flex-col gap-6 md:text-base text-xs">
                      <Link href="/game/123" className="group cursor-pointer"><span className="group-hover:visible invisible mr-2">*</span><span>Nova Partida</span></Link>
                      <div className="group cursor-pointer"><span className="group-hover:visible invisible mr-2">*</span><span>Meus Decks</span></div>
                    </div>
                  </TripleBorder>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => toggleCRT(setCrtActivated)} style={pixelBorder('black', 1)} className="fixed cursor-pointer w-12 h-12 right-3 bottom-2 bg-white rounded-[10px] p-0.5">
        <div className="border-black border-2 w-full h-full flex items-center justify-center">
          {crtActivated ? (
            <div className="w-5/6 h-5/6 bg-black"/>
          ) : (
            <svg className='w-full h-full' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 2H22V22H2V2ZM4 4V8H8V12H4V16H8V20H12V16H16V20H20V16H16V12H20V8H16V4H12V8H8V4H4ZM12 12H8V16H12V12ZM12 8V12H16V8H12Z" fill="currentColor"></path></svg>
          )}
        </div>
      </div>
    </main>
  );
}
