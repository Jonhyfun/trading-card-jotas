import { Dispatch, ForwardedRef, MutableRefObject, SetStateAction, forwardRef, useCallback, useEffect, useState } from "react"
import { Card } from "./Card"
import { TripleBorderProps } from "./TripleBorder"

//todo Matematica Man

export type CardData = {
  src: string
  id: string
  borderColor: TripleBorderProps['borderColor']
}

type StackedCardsProps = {
  cardState: [CardData[], Dispatch<SetStateAction<CardData[]>>]
  gutterMultiplication?: number
  reverse?: boolean
  selectedCard?: CardData
  onCardPlacement?: (card: CardData) => void
  onCardClick?: (card: CardData) => void
}

export const StackedCards = forwardRef(({cardState, onCardClick, onCardPlacement, selectedCard, reverse = false} : StackedCardsProps, ref: ForwardedRef<HTMLOListElement>) => {
  const [cards, setCards] = cardState
  const [hoveredCardId, setHoveredCardId] = useState<CardData['id'] | undefined>()

  const handleCardPlacement = useCallback(() => {
    if(selectedCard) {
      setCards((current) => ([...current, selectedCard]))
      if(onCardPlacement) onCardPlacement(selectedCard)
    }
  },[onCardPlacement, selectedCard, setCards])

  useEffect(() => {
    //? O ref ta vindo de fora por que acho que embreve ele vai triggar esse scroll em resposta à uma mensagem do socket.
    const stackRef = ref as MutableRefObject<HTMLOListElement>
    if(selectedCard && stackRef.current) {
      stackRef.current.scroll(stackRef.current.scrollWidth, 0);
    }
  },[ref, selectedCard])
  
  return (
    <ol ref={ref} style={{gridAutoFlow: 'column'}} className="grid grid-cols-[repeat(auto-fit,_minmax(3.875rem,_3.875rem))] md:grid-cols-[repeat(auto-fit,_minmax(4.875rem,_4.875rem))] gap-0.5 overflow-x-auto w-full">
      {cards.map((card, i) => (
        <li key={`${card.id}-stack-${reverse}-${card.borderColor}`} onMouseEnter={() => setHoveredCardId(card.id)} onMouseLeave={() => setHoveredCardId(undefined)} className={`cursor-pointer ${(hoveredCardId !== undefined && hoveredCardId !== card.id) ? 'opacity-25' : ''}`}>
          <button className="w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
            <Card borderColor={card.borderColor} card={card}/>
          </button>
        </li>
      ))}
      {selectedCard && (
        <li className="w-[3.875rem] md:w-[4.875rem] h-[5.325rem] md:h-[6.75rem] group relative">
          <li
            className="absolute top-0 left-0 border-dashed border-2 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] bg-bg-internal bg-opacity-45 cursor-pointer"
          />
          <button onClick={handleCardPlacement} className="absolute top-0 left-0 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] invisible group-hover:visible opacity-45">
            <Card borderColor={selectedCard.borderColor} card={selectedCard} className="w-full"/>
          </button>
        </li>
      )}
    </ol>
  )
})