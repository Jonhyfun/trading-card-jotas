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
      <div className="w-full h-full flex justify-around items-start">
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
    </Layout>
  )
}