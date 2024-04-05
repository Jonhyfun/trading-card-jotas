import { CardData } from "./StackedCards"
import { TripleBorder, TripleBorderProps } from "./TripleBorder"

type CardComponentProps = {
  card: CardData
  borderColor?: TripleBorderProps['borderColor']
  className?: string
  facingDown?: boolean
}

export function Card({card, className, borderColor = "primary-light", facingDown = false} : CardComponentProps) {
  return (
    <TripleBorder borderColor={borderColor} className="w-full h-full">
      <span className={`flex justify-center pt-1 h-full ${facingDown ? "text-primary bg-primary" : undefined} ${className}`}>
        {card}
      </span>
    </TripleBorder>
  )
}