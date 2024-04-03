import { MouseEventHandler, useCallback, useState } from "react"
import { TripleBorder } from "./TripleBorder"

type StackedCardsProps = {
  interactive?: boolean
  gutterMultiplication?: number
  reverse?: boolean
  cardContentClassNameOverwrite?: string
}

export function StackedCards({interactive, cardContentClassNameOverwrite, reverse = false, gutterMultiplication = 4} : StackedCardsProps) {
  const [cards, setCards] = useState(['1','2','3','4','5'])
  const [hoveredCard, setHoveredCard] = useState<string | undefined>()
  
  const cycleThrough : MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    if(!interactive) return;
    setCards((current) => {
      const newCurrent = [...current]
      const oldLast = newCurrent.pop();
      return oldLast ? [oldLast, ...newCurrent] : newCurrent
    })
  },[interactive])
  
  return (
    <ol className="grid place-content-center overflow-visible w-fit">
      {cards.map((card, i) => (
        <li key={card} onMouseEnter={() => setHoveredCard(card)} onMouseLeave={() => setHoveredCard(undefined)} className="cursor-pointer" style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${i*gutterMultiplication}px)`}}>
          <button onClick={cycleThrough}>
            <TripleBorder className={`select-none ${hoveredCard === card ? 'opacity-100' : !hoveredCard ? '' : 'opacity-20'}`}>
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