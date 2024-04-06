import { useState } from "react"
import { TripleBorderProps } from "./TripleBorder"
import { Card } from "./Card"
import { mockCards } from "@/utils"

export type CardData = {
  src: string
  id: string
}

type StackedCardsProps = {
  //interactive?: boolean
  color?: TripleBorderProps['borderColor']
  gutterMultiplication?: number
  reverse?: boolean
  cardContentClassNameOverwrite?: string
  onCardClick?: (card: CardData) => void
}

export function StackedCards({/*interactive, */ onCardClick, cardContentClassNameOverwrite, color = 'primary-light', reverse = false, gutterMultiplication = 4} : StackedCardsProps) {
  const [cards, setCards] = useState(mockCards)
  const [hoveredCardId, setHoveredCardId] = useState<CardData['id'] | undefined>()
  
  //const cycleThrough : MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
  //  if(!interactive) return;
  //  setCards((current) => {
  //    const newCurrent = [...current]
  //    const oldLast = newCurrent.pop();
  //    return oldLast ? [oldLast, ...newCurrent] : newCurrent
  //  })
  //},[interactive])
  
  return (
    <ol className="grid place-content-center overflow-visible w-fit">
      {cards.map((card, i) => (
        <li key={`${card.id}-stack-${reverse}-${color}`} onMouseEnter={() => setHoveredCardId(card.id)} onMouseLeave={() => setHoveredCardId(undefined)} className={`cursor-pointer ${(hoveredCardId !== undefined && hoveredCardId !== card.id) ? 'opacity-25' : ''}`} style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${i*gutterMultiplication}px)`}}>
          <button className="h-[5.25rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <Card borderColor={color} card={card} className="w-12 h-[4rem]"/>
          </button>
        </li>
      ))}
    </ol>
  )
}