import { TextPreviewIcon } from "@/icons/TextPreview";
import { CardData } from "./StackedCards"
import { TripleBorder, TripleBorderProps } from "./TripleBorder"
import { pixelBorder } from "@/utils/any";
import { BackendCard } from "@/hooks/useCards";

type CardComponentProps = {
  card: CardData
  borderColor?: TripleBorderProps['borderColor']
  className?: string
  facingDown?: boolean
}

export function Card({card, className = '', borderColor = "primary-light", facingDown = false} : CardComponentProps) {
  return (
    <TripleBorder borderColor={borderColor} className="w-full h-full">
      <div className={`flex justify-start pt-1 pb-1 h-full items-center flex-col gap-1 ${facingDown ? "text-primary bg-primary" : ''} ${className}`}>
        {!facingDown && (
          <>
            <img draggable={false} className="w-[calc(100%-10px)] aspect-square select-none" style={{...pixelBorder('black')}} src={card.src}/>
            <TextPreviewIcon/>
          </>
        )}
      </div>
    </TripleBorder>
  )
}