import { useCallback, useState } from "react"
import { Card } from "./Card"
import { TripleBorderProps } from "./TripleBorder"

export type CardData = {
  src: string
  id: string
  borderColor: TripleBorderProps['borderColor']
}

type StackedCardsProps = {
  cards: CardData[]
  gutterMultiplication?: number
  reverse?: boolean
  selectedCard?: CardData
  onCardPlacement?: (card: CardData) => void
  onCardClick?: (card: CardData) => void
}

export function StackedCards({cards: _cards, onCardClick, onCardPlacement, selectedCard, reverse = false, gutterMultiplication = 4} : StackedCardsProps) {
  const [cards, setCards] = useState(_cards)
  const [hoveredCardId, setHoveredCardId] = useState<CardData['id'] | undefined>()

  const handleCardPlacement = useCallback(() => {
    if(selectedCard) {
      setCards((current) => ([...current, selectedCard]))
      if(onCardPlacement) onCardPlacement(selectedCard)
    }
  },[onCardPlacement, selectedCard])
  
  return (
    <ol className="grid place-content-center overflow-visible w-fit">
      {cards.map((card, i) => (
        <li key={`${card.id}-stack-${reverse}-${card.borderColor}`} onMouseEnter={() => setHoveredCardId(card.id)} onMouseLeave={() => setHoveredCardId(undefined)} className={`cursor-pointer ${(hoveredCardId !== undefined && hoveredCardId !== card.id) ? 'opacity-25' : ''}`} style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${i*gutterMultiplication}px)`}}>
          <button className="h-[5.25rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <Card borderColor={card.borderColor} card={card} className="w-12 h-[4rem]"/>
          </button>
        </li>
      ))}
      {selectedCard && (
        <li className="h-[5.25rem] group relative" style={{gridColumn: 1, gridRow: 1, transform: `translateY(${!reverse ? '-' : ''}${(cards.length*gutterMultiplication) + 62}px)`}}>
          <li
            className="absolute top-0 left-0 border-dashed border-2 w-full h-[5.25rem] bg-bg-internal bg-opacity-45 cursor-pointer"
          />
          <button onClick={handleCardPlacement} className="absolute top-0 left-0 h-[5.25rem] invisible group-hover:visible opacity-45">
            <Card borderColor={selectedCard.borderColor} card={selectedCard} className="w-12 h-[4rem]"/>
          </button>
        </li>
      )}
    </ol>
  )
}