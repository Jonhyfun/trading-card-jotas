import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { ProfileSquare } from "./ProfileSquare";
import { CardData } from "./StackedCards";
import { TripleBorder, TripleBorderProps } from "./TripleBorder";
import { Card } from "./Card";
import { mockCards } from "@/utils";

export type DeckCards = (CardData & {
  selected?: boolean
})[]

type PlayerDeckProps = {
  playerSrc: string
  deckState?: [DeckCards, Dispatch<SetStateAction<DeckCards>>]
  rival?: boolean
  onCardClick?: (card: CardData) => void
}

export function PlayerDeck({playerSrc, onCardClick = () => {}, deckState: _deckState, rival = false} : PlayerDeckProps) {
  const deckState = useState<DeckCards>([])
  const [deck, setDeck] = _deckState ?? deckState;

  //const cycleThrough : MouseEventHandler<HTMLButtonElement> = ((e) => {
  //  setDeck((current) => {
  //    const newCurrent = [...current]
  //    const oldNew = newCurrent.shift();
  //    return oldNew ? [...newCurrent, oldNew] : newCurrent
  //  })
  //})

  return (
    <div className={`w-full flex gap-2 items-center ${rival ? 'flex-row-reverse' : ''} md:gap-4`}>
      <ProfileSquare borderColor={rival ? "secondary-light" : "primary-light"} className="w-16 md:w-24 shrink-0 col-span-1" src={playerSrc} reverse={rival}/>
      <TripleBorder borderColor="gray-light" className="w-full">
        <div className="md:flex relative md:gap-0.5 md:justify-start items-center justify-center flex-wrap w-full h-[4.75rem] grid grid-cols-5 gap-1 overflow-y-hidden overflow-x-auto md:overflow-y-visible md:overflow-visible">
          {(rival ? mockCards as DeckCards : deck).map((card) => (
            <div key={`${card.id}-inventory`} onClick={() => onCardClick((card as CardData))} className={`${card.selected ? 'md:-translate-y-3 -translate-y-1' : ''} md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-3 hover:-translate-y-1`}>
              <div className="min-w-12 w-12 h-[4.25rem] block">
                <Card className="text-xs" card={(card as CardData)} facingDown={rival} />
              </div>
            </div>
          ))}
        </div>
      </TripleBorder>
    </div>
  )
}