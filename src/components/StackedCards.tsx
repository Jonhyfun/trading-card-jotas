import { MouseEventHandler, useCallback, useState } from "react"
import { TripleBorder, TripleBorderProps } from "./TripleBorder"

export type Card = string

type StackedCardsProps = {
  //interactive?: boolean
  color?: TripleBorderProps['borderColor']
  gutterMultiplication?: number
  reverse?: boolean
  cardContentClassNameOverwrite?: string
  onCardClick?: (card: Card) => void
}

export function StackedCards({/*interactive, */ onCardClick, cardContentClassNameOverwrite, color = 'primary-light', reverse = false, gutterMultiplication = 4} : StackedCardsProps) {
  const [cards, setCards] = useState(['1','2','3','4','5'])
  const [hoveredCard, setHoveredCard] = useState<Card | undefined>()
  
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
        <li key={`${card}-stack-${reverse}-${color}`} onMouseEnter={() => setHoveredCard(card)} onMouseLeave={() => setHoveredCard(undefined)} className="cursor-pointer" style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${i*gutterMultiplication}px)`}}>
          <button onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <TripleBorder borderColor={color} className={`select-none ${hoveredCard === card ? 'opacity-100' : !hoveredCard ? '' : 'opacity-20'}`}>
              <div className={cardContentClassNameOverwrite ? cardContentClassNameOverwrite : 'px-0.5 py-1.5'}>
                {card}
              </div>
            </TripleBorder>
          </button>
        </li>
      ))}
    </ol>
  )
}