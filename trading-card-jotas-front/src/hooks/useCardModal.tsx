import { useCallback } from "react";
import { useModal } from "./useModal";
import { useCards } from "./useCards";
import { LightColors, TripleBorder } from "@/components/TripleBorder";

export function useCardModal() {
  const { openModal } = useModal()
  const { cards } = useCards()

  const openCardModal = useCallback((cardKey: string, borderColor: LightColors) => {
    const card = cards.find(({key}) => key === cardKey)
    if(!card) return
    openModal({
      borderColor: borderColor,
      children: (
        <div className="w-[16rem] h-[20rem] p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
          <TripleBorder borderColor="gray-light">
            <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
              <img className="w-full h-full" style={{imageRendering: 'pixelated'}} src={`${process.env.NEXT_PUBLIC_API_URL}${card.src}`}/>
            </div>
          </TripleBorder>
          <TripleBorder className="w-full" borderColor="gray-light">
            <span className="text-xs p-3 w-full h-[6.75rem] overflow-y-auto block leading-5 bg-bg-internal text-black">
              {card.desc}
            </span>
          </TripleBorder>
        </div>
      )
    })
  },[cards, openModal])

  return { openCardModal }
}