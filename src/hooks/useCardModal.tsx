import { useCallback } from "react";
import { useModal } from "./useModal";
import { useCards } from "./useCards";
import { LightColors, TripleBorder } from "@/components/TripleBorder";
import { textOutline } from "@/utils";

export function useCardModal() {
  const { openModal } = useModal()
  const { cards } = useCards()

  const openCardModal = useCallback((cardKey: string, borderColor: LightColors) => {
    console.log({ cardKey })
    const card = cards.find(({ key }) => key === cardKey)
    if (!card) return
    openModal({
      ignoreBorder: true,
      borderColor: borderColor,
      children: (
        <TripleBorder>
          <div className="w-64 h-80 p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
            <TripleBorder borderColor="gray-light">
              <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
                <img className="w-full h-full" style={{ imageRendering: 'pixelated' }} src={`${process.env.NEXT_PUBLIC_API_URL}${card.src}`} />
              </div>
            </TripleBorder>
            <TripleBorder className="w-full" borderColor="gray-light">
              <span style={textOutline('black', 2)} className="text-sm p-3 w-full h-[6.75rem] overflow-y-auto block leading-5 bg-bg-internal text-white">
                {card.desc}
              </span>
            </TripleBorder>
          </div>
        </TripleBorder>
      )
    })
  }, [cards, openModal])

  return { openCardModal }
}