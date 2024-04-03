import { Inter } from "next/font/google";
import { hexToRgb, pixelBorder, toggleCRT } from "@/styles/utils";
import { Palette } from "../../tailwind.config";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [crtActivated, setCrtActivated] = useState(false);

  return (
    <main
      className={`h-screen w-screen ${inter.className} bg-bg-external flex items-center justify-center p-8`}
    >
      <div
        style={{
          ...pixelBorder('black', 1)
        }}
        className="w-full h-full max-w-[40rem] max-h-[40rem]"
      >
        <div
          className="w-full h-full bg-black rounded-[10px]"
        >
          <div
            style={{
              ...pixelBorder(hexToRgb(Palette['primary'])!, 1)
            }}
            className="w-full h-full p-0.5 bg-bg-internal rounded-[6px]"
          >
            <div
              className="w-full h-full border-2 border-primary-light bg-bg-internal"
            >
              <div className="w-full h-full border-2 border-black bg-bg-internal" />
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
