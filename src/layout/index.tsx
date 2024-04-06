import { Press_Start_2P } from "next/font/google";
import { hexToRgb, pixelBorder, toggleCRT, Palette } from "@/utils";
import { PropsWithChildren, useMemo, useState } from "react";
import { useModal } from "@/hooks/useModal";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: ['400'] });

export const useCRT = () => { //TODO localstorage
  const [crtActivated, setCrtActivated] = useState(false);
  return useMemo(() => (
    <div onClick={() => toggleCRT(setCrtActivated)} style={pixelBorder('black', 1)} className="fixed cursor-pointer w-12 h-12 right-3 bottom-2 bg-white rounded-[0.438rem] p-0.5">
      <div className="border-black border-2 w-full h-full flex items-center justify-center">
        {crtActivated ? (
          <div className="w-5/6 h-5/6 bg-black"/>
          ) : (
            <svg className='w-full h-full' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2 2H22V22H2V2ZM4 4V8H8V12H4V16H8V20H12V16H16V20H20V16H16V12H20V8H16V4H12V8H8V4H4ZM12 12H8V16H12V12ZM12 8V12H16V8H12Z" fill="currentColor"></path></svg>
          )
        }
      </div>
    </div>
  ),[crtActivated])
}

export function Layout({children} : PropsWithChildren<unknown>) {
  const crtButton = useCRT()
  const {Modal} = useModal()

  return (
    <main
      className={`h-screen w-screen ${pixelFont.className} bg-bg-external flex items-center justify-center p-8`}
    >
      <div
        style={{
          ...pixelBorder('black', 1),
          boxShadow: '3px 3px 8px 2px #00000040'
        }}
        className="w-full h-full md:max-w-[40rem] md:max-h-[40rem] max-h-[36rem] rounded-[0.625rem]"
      >
        <div className="bg-black w-full h-full">
          <div
            className="w-full h-full bg-black rounded-[0.625rem]"
          >
            <div
              style={{
                ...pixelBorder(hexToRgb(Palette['primary'])!, 1),
                boxShadow: `inset 0 0 0 20px ${Palette['bg-internal']}`
              }}
              className="w-full h-full bg-black p-0.5 rounded-[0.375]"
            >
              <div
                className="w-full h-full border-2 border-primary-light bg-bg-internal"
                >
                <div className="w-full h-full border-2 border-black bg-bg-internal p-3">
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
  )
}