import { Card, StackedCards } from "@/components/StackedCards";
import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { Layout } from "@/layout";
import { Palette } from "@/styles/utils";
import { useEffect } from "react";

export default function Game() {
  const {openModal} = useModal()

  const handleCardClick = (borderColor: TripleBorderProps['borderColor'], card: Card) => {
    openModal({
      borderColor,
      children: (
        <div className="w-[256px] h-[320px] p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
          <TripleBorder borderColor="gray-light">
            <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
              {card}
            </div>
          </TripleBorder>
          <TripleBorder borderColor="gray-light">
            <span className="text-xs p-3 w-full h-full block leading-5 bg-bg-internal text-black">
              Esta carta tem o efeito de fazer alguma coisa acontecer.
            </span>
          </TripleBorder>
        </div>
      )
    })
  }

  return (
    <Layout>
      <div className="h-full w-full flex flex-col">
      <div className="w-full flex justify-end">
        {/**TODO componentizar */}
          <TripleBorder borderColor="secondary-light" className="w-24 h-24 -scale-x-100"><img style={{imageRendering: 'pixelated'}} width={80} height={80} src="/bowgor80.png"/></TripleBorder>
        </div>
        <div className="w-full h-full flex justify-around items-start md:pt-12 pt-6">
          <StackedCards
            color="primary-light"
            onCardClick={(card) => handleCardClick("primary-light", card)}
            cardContentClassNameOverwrite="w-12 h-16 pt-1"
            gutterMultiplication={25}
            reverse
          />
          <StackedCards
            color="secondary-light"
            onCardClick={(card) => handleCardClick("secondary-light", card)}
            cardContentClassNameOverwrite="w-12 h-16 pt-1"
            gutterMultiplication={25}
            reverse
          />
        </div>
        <div className="w-full">
          <TripleBorder className="w-24 h-24"><img style={{imageRendering: 'pixelated'}} width={80} height={80} src="/indio80.png"/></TripleBorder>
        </div>
      </div>
    </Layout>
  )
}