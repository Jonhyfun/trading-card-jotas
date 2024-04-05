import { MouseEventHandler, useState } from "react";
import { ProfileSquare } from "./ProfileSquare";
import { CardData } from "./StackedCards";
import { TripleBorder } from "./TripleBorder";
import { Card } from "./Card";

type PlayerDeckProps = {
  playerSrc: string
  deck?: CardData[]
  rival?: boolean
  onCardClick?: (card: CardData) => void
}

export function PlayerDeck({playerSrc, onCardClick = () => {},deck: _deck = [], rival = false} : PlayerDeckProps) {

  const [deck, setDeck] = useState(_deck)

  const cycleThrough : MouseEventHandler<HTMLButtonElement> = ((e) => {
    setDeck((current) => {
      const newCurrent = [...current]
      const oldNew = newCurrent.shift();
      return oldNew ? [...newCurrent, oldNew] : newCurrent
    })
  })

  return (
    <div className={`w-full flex gap-2 items-center ${rival ? 'flex-row-reverse' : ''} md:gap-4`}>
      <ProfileSquare borderColor={rival ? "secondary-light" : "primary-light"} className="w-24 shrink-0 col-span-1" src={playerSrc} reverse={rival}/>
      <TripleBorder borderColor="gray-light" className="w-full">
        <div className="flex relative gap-0.5 flex-wrap md:justify-start overflow-y-hidden md:overflow-y-visible items-center justify-center w-full h-[76px]">
          {(rival ? ['1','2','3','4','5'] : deck).map((card) => (
            <div key={`${card}-inventory`} className="md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-5 hover:-translate-y-2">
              <div onClick={() => onCardClick(card)} className="md:w-12 md:h-[68px] w-9 h-[46px] block">
                <Card className="text-xs" card={card} facingDown={rival} />
              </div>
            </div>
          ))}
          {!rival && (
            /*//TODO fake scrollbar (check which one is the first element?) */
            <span onClick={cycleThrough} className="absolute right-0 top-0  block md:hidden">
              <svg className="size-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z" fill="currentColor">
                </path>
              </svg>
            </span>
          )}
        </div>
      </TripleBorder>
    </div>
  )
}