import { PropsWithChildren } from "react";
import { Palette, PickEndsWith, hexToRgb, pixelBorder } from "@/utils";

export type LightColors = keyof PickEndsWith<typeof Palette, "-light">;

export type TripleBorderProps = PropsWithChildren<{
  backgroundColor?: string;
  className?: string;
  borderColor?: LightColors;
  onClick?: () => void;
}>;

export function TripleBorder({
  children,
  onClick,
  className = "",
  borderColor = "primary-light",
  backgroundColor = Palette["bg-internal"],
}: TripleBorderProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...pixelBorder("black", 1),
      }}
      className={className}
    >
      <div className="bg-black w-full h-full">
        <div className="bg-black w-full h-full">
          <div
            style={{
              ...pixelBorder(hexToRgb(Palette[borderColor])!, 1),
              boxShadow: `inset 0 0 0 20px ${backgroundColor}`,
            }}
            className="p-0.5 bg-black w-full h-full"
          >
            <div
              style={{
                backgroundColor,
                borderStyle: "solid",
                borderColor: (Palette as any)[
                  `${borderColor.split("-light")[0]}` as any
                ],
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
  );
}
