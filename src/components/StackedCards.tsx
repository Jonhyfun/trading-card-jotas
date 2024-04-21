import { ForwardedRef, MutableRefObject, forwardRef, useCallback, useEffect, useState } from "react"
import { Card } from "./Card"
import { TripleBorderProps } from "./TripleBorder"

//todo Matematica Man

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

export const StackedCards = forwardRef(({cards: _cards, onCardClick, onCardPlacement, selectedCard, reverse = false} : StackedCardsProps, ref: ForwardedRef<HTMLOListElement>) => {
  const [cards, setCards] = useState(_cards)
  const [hoveredCardId, setHoveredCardId] = useState<CardData['id'] | undefined>()

  const handleCardPlacement = useCallback(() => {
    if(selectedCard) {
      setCards((current) => ([...current, selectedCard]))
      if(onCardPlacement) onCardPlacement(selectedCard)
    }
  },[onCardPlacement, selectedCard])

  useEffect(() => {
    //? O ref ta vindo de fora por que acho que embreve ele vai triggar esse scroll em resposta à uma mensagem do socket.
    const stackRef = ref as MutableRefObject<HTMLOListElement>
    if(selectedCard && stackRef.current) {
      stackRef.current.scroll(stackRef.current.scrollWidth, 0);
    }
  },[ref, selectedCard])
  
  return (
    <ol ref={ref} style={{gridAutoFlow: 'column', gridTemplateColumns: 'repeat(auto-fit, minmax(78px, 78px))'}} className="grid gap-0.5 overflow-x-auto">
      {(cards ?? []).map((card, i) => (
        <li key={`${card.id}-stack-${reverse}-${card.borderColor}`} onMouseEnter={() => setHoveredCardId(card.id)} onMouseLeave={() => setHoveredCardId(undefined)} className={`cursor-pointer ${(hoveredCardId !== undefined && hoveredCardId !== card.id) ? 'opacity-25' : ''}`}>
          <button className="h-[6.75rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <Card borderColor={card.borderColor} card={card} className="w-[3.625rem] h-[6.75rem]"/>
          </button>
        </li>
      ))}
      {selectedCard && (
        <li className="h-[6.75rem] group relative">
          <li
            className="absolute top-0 left-0 border-dashed border-2 w-[4.875rem] h-[6.75rem] bg-bg-internal bg-opacity-45 cursor-pointer"
          />
          <button onClick={handleCardPlacement} className="absolute top-0 left-0 h-[6.75rem] invisible group-hover:visible opacity-45">
            <Card borderColor={selectedCard.borderColor} card={selectedCard} className="w-[3.625rem] h-[6.75rem]"/>
          </button>
        </li>
      )}
    </ol>
  )
})