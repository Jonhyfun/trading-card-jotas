import { PropsWithChildren } from "react";
import { Palette, PickEndsWith, hexToRgb, pixelBorder } from "@/styles/utils";

type LightColors = keyof PickEndsWith<typeof Palette, '-light'>

type TripleBorderProps = {
  backgroundColor?: string,
  className?: string
  borderColor?: LightColors
}

export function TripleBorder({children, className = '', borderColor = 'primary-light', backgroundColor = Palette['bg-internal']} : PropsWithChildren<TripleBorderProps>) {
  return (
    <div
    style={{
      ...pixelBorder('black', 1)
    }}
    className={`${className} md:max-w-[40rem] md:max-h-[40rem] max-h-[30rem] max-w-[19rem]`}
  >
    <div className="bg-black w-full h-full">
      <div
        className="bg-black rounded-[10px] w-full h-full"
      >
        <div
          style={{
            ...pixelBorder(hexToRgb(Palette[borderColor])!, 1),
            backgroundColor,
          }}
          className="p-0.5 rounded-[6px] w-full h-full"
          >
          <div
            style={{
              backgroundColor,
              borderStyle: 'solid',
              borderColor: (Palette as any)[`${borderColor.split('-light')[0]}` as any],
              borderWidth: 2,
            }}
            className="w-full h-full"
          >
            <div className="border-2 border-black w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}