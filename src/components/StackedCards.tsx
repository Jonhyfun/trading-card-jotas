import { MouseEventHandler, useCallback, useState } from "react"
import { TripleBorder, TripleBorderProps } from "./TripleBorder"
import { Card } from "./Card"

export type CardData = string

type StackedCardsProps = {
  //interactive?: boolean
  color?: TripleBorderProps['borderColor']
  gutterMultiplication?: number
  reverse?: boolean
  cardContentClassNameOverwrite?: string
  onCardClick?: (card: CardData) => void
}

export function StackedCards({/*interactive, */ onCardClick, cardContentClassNameOverwrite, color = 'primary-light', reverse = false, gutterMultiplication = 4} : StackedCardsProps) {
  const [cards, setCards] = useState(['1','2','3','4','5'])
  const [hoveredCard, setHoveredCard] = useState<CardData | undefined>()
  
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
        <li key={`${card}-stack-${reverse}-${color}`} onMouseEnter={() => setHoveredCard(card)} onMouseLeave={() => setHoveredCard(undefined)} className={`cursor-pointer ${(hoveredCard !== undefined && hoveredCard !== card) ? 'opacity-25' : ''}`} style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${i*gutterMultiplication}px)`}}>
          <button className="h-[5.25rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <Card borderColor={color} card={card} className="w-12 h-[4rem]"/>
          </button>
        </li>
      ))}
    </ol>
  )
}