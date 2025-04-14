import { pixelBorder } from "@/utils";
import { Card } from "./Card";

export function Loading({ text = "Carregando" }: { text?: string }) {
  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full h-full">
      <div className="w-[4.625rem] h-[6.75rem] animate-spin-3d">
        <Card
          card={{
            borderColor: "gray-light",
            cardKey: "loading",
            id: "loading",
            src: "",
          }}
          facingDown
        />
      </div>
      <div className="flex gap-5 items-center loading-dots animate-appear">
        <span>{text}</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`loading-${i}`}
            style={{ ...pixelBorder("black") }}
            className="w-px h-px mt-1 rounded-full"
          ></div>
        ))}
      </div>
    </div>
  );
}
