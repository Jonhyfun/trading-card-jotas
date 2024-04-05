import { CardData } from "./StackedCards"
import { TripleBorder, TripleBorderProps } from "./TripleBorder"
import { pixelBorder } from "@/styles/utils";

type CardComponentProps = {
  card: CardData
  borderColor?: TripleBorderProps['borderColor']
  className?: string
  facingDown?: boolean
}

export function Card({card, className = '', borderColor = "primary-light", facingDown = false} : CardComponentProps) {
  return (
    <TripleBorder borderColor={borderColor} className="w-full h-full">
      <span className={`flex justify-start pt-1 pb-1 h-full items-center flex-col gap-1 ${facingDown ? "text-primary bg-primary" : ''} ${className}`}>
        {!facingDown && (
          <>
            <img className="w-[calc(100%-0.625rem)] aspect-square" style={{...pixelBorder('black'), imageRendering: 'pixelated'}} src="/indio80.png"/>
            <div className="flex flex-col gap-px w-full px-2 pt-1">
              {Array.from({length: 5}).map((_,i) => (
                <div key={`${card}-faketext-${Math.random()}`} className="w-full h-[0.063rem] bg-black"/>
              ))}
            </div>
          </>
        )}
      </span>
    </TripleBorder>
  )
}