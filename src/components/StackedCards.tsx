import { Dispatch, ForwardedRef, MutableRefObject, SetStateAction, forwardRef, useEffect, useState } from "react"
import { Card } from "./Card"
import { TripleBorderProps } from "./TripleBorder"
import { GameData, ServerCard, gameDataAtom } from "@/hooks/useGameSocket"
import { errorToast } from "@/utils/toast"
import { useRecoilCallback } from "recoil"

//todo Matematica Man
export interface CardData extends ServerCard {
  src: string
  borderColor: Exclude<TripleBorderProps['borderColor'], undefined>
}

type StackedCardsProps = {
  cardState: [CardData[], Dispatch<SetStateAction<CardData[]>>]
  forStance?: 'attack' | 'defense'
  selectedCard?: CardData
  onCardPlacement?: (card: CardData) => void
  onCardClick?: (card: CardData) => void
  gameData: GameData
  sidePadding?: string
}

export const StackedCards = forwardRef(({ cardState, onCardClick, onCardPlacement, selectedCard, gameData, forStance, sidePadding }: StackedCardsProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [cards, setCards] = cardState
  const [hoveredCardId, setHoveredCardId] = useState<CardData['id'] | undefined>()

  const handleCardPlacement = useRecoilCallback(({ set }) => () => {
    if (selectedCard) {
      set(gameDataAtom, (current) => ({ ...current, me: { ...current.me, stance: 'pending' as GameData['me']['stance'] } }))
      setCards((current) => ([...current, selectedCard]))
      if (onCardPlacement) onCardPlacement(selectedCard)
    }
    else {
      errorToast('Selecione sua carta primeiro!')
    }
  }, [onCardPlacement, selectedCard, setCards])

  useEffect(() => {
    //? O ref ta vindo de fora por que acho que embreve ele vai triggar esse scroll em resposta à uma mensagem do socket.
    const stackRef = ref as MutableRefObject<HTMLDivElement>
    if (selectedCard && stackRef.current) {
      stackRef.current.scroll(stackRef.current.scrollWidth, 0);
    }
  }, [ref, selectedCard])


  return (
    <div ref={ref} className="flex overflow-x-auto w-full min-h-[3.875] md:min-h-[4.875rem]">
      {sidePadding && <div style={{ width: `${sidePadding}` }} className="h-full flex-shrink-0"></div>}
      <ol style={{ gridAutoFlow: 'column' }} className="grid grid-cols-[repeat(auto-fit,_minmax(3.875rem,_3.875rem))] md:grid-cols-[repeat(auto-fit,_minmax(4.875rem,_4.875rem))] gap-0.5">
        {cards.map((card, i) => (
          <li key={`${card.id}-stack-${forStance}-${card.borderColor}`} onMouseEnter={(e) => setHoveredCardId(card.id)} onMouseLeave={(e) => setHoveredCardId(undefined)} className={`relative cursor-pointer ${(hoveredCardId !== undefined && hoveredCardId !== card.id) ? 'opacity-25' : ''}`}>
            <button className="w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem]" onClick={onCardClick ? () => onCardClick(card) : undefined}>
              <Card borderColor={card.borderColor} card={card} />
            </button>
            {card.visualEffects?.includes('ghost') ? (
              <div
                style={{ background: `url(${process.env.NEXT_PUBLIC_API_URL}/visualEffects/ghost.png)` }}
                className="absolute bg-center bg-contain bg-no-repeat top-0 right-0 w-1/2 h-1/2 opacity-65"
                onClick={onCardClick ? () => onCardClick(card) : undefined}
              >
              </div>
            ) : (
              <>
                {card.visualEffects?.[0] && ( //TODO mostrar varios
                  <div
                    style={{ background: `url(${process.env.NEXT_PUBLIC_API_URL}/visualEffects/${card.visualEffects[0]}.png)` }}
                    className={`absolute bg-center bg-contain bg-no-repeat ${card.visualEffects[0] === 'overwritten' ? 'top-0 left-0 w-full h-full' : 'top-0 right-0 w-1/2 h-1/2'} opacity-65`}
                    onClick={onCardClick ? () => onCardClick(card) : undefined}
                  >
                  </div>
                )}
              </>
            )}
          </li>
        ))}
        {(gameData.gameState === 'running' && (gameData.me.stance === forStance)) && (
          <li className="w-[3.875rem] md:w-[4.875rem] h-[5.325rem] md:h-[6.75rem] group relative">
            <div
              className="absolute top-0 left-0 border-dashed border-2 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] bg-bg-internal bg-opacity-45 cursor-pointer"
            />
            <button onClick={handleCardPlacement} className="absolute top-0 left-0 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] invisible group-hover:visible opacity-45">
              {selectedCard && <Card borderColor={selectedCard.borderColor} card={selectedCard} className="w-full" />}
            </button>
          </li>
        )}
      </ol>
      {sidePadding && <div style={{ width: `${sidePadding}` }} className="h-full flex-shrink-0"></div>}
    </div>
  )
})