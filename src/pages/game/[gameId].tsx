import { ProfileSquare } from "@/components/ProfileSquare";
import { Card, StackedCards } from "@/components/StackedCards";
import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { Layout } from "@/layout";
import { MouseEventHandler, useCallback, useState } from "react";

export default function Game() {
  const {openModal} = useModal()

  const [yourDeck, setYourDeck] = useState(['1', '2', '3', '4', '5'])

  const cycleThrough : MouseEventHandler<HTMLButtonElement> = ((e) => {
    setYourDeck((current) => {
      const newCurrent = [...current]
      const oldNew = newCurrent.shift();
      return oldNew ? [...newCurrent, oldNew] : newCurrent
    })
  })

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
      <div className="w-full flex gap-2 items-center flex-row-reverse md:gap-4">
          <ProfileSquare borderColor="primary-light" className="w-24 shrink-0 col-span-1" src="/bowgor80.png" reverse/>
          <TripleBorder borderColor="gray-light" className="w-full">
            <div className="flex relative gap-0.5 flex-wrap md:justify-start overflow-y-hidden md:overflow-y-visible items-center justify-center w-full h-[76px]">
              {['1','2','3','4','5'].map((card) => (
                <div key={`${card}-inventory-rival`} className="md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-5 hover:-translate-y-2">
                  <div className="md:w-12 md:h-[68px] w-9 h-[46px] block">
                    <TripleBorder borderColor="primary-light" className="w-full h-full">
                      <span className="flex justify-center pt-1 text-xs h-full text-primary bg-primary">
                        {card}
                      </span>
                    </TripleBorder>
                  </div>
                </div>
              ))}
            </div>
          </TripleBorder>
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
        <div className="w-full flex gap-2 items-center md:gap-4">
          <ProfileSquare borderColor="primary-light" className="w-24 shrink-0 col-span-1" src="/indio80.png"/>
          <TripleBorder borderColor="gray-light" className="w-full">
            <div className="flex relative gap-0.5 flex-wrap md:justify-start overflow-y-hidden md:overflow-y-visible items-center justify-center w-full h-[76px]">
              {yourDeck.map((card) => (
                <div key={`${card}-inventory`} className="md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-5 hover:-translate-y-2">
                  <div className="md:w-12 md:h-[68px] w-9 h-[46px] block">
                    <TripleBorder borderColor="primary-light" className="w-full h-full">
                      <span className="flex justify-center pt-1 text-xs">
                        {card}
                      </span>
                    </TripleBorder>
                  </div>
                </div>
              ))}
              {/*//TODO fake scrollbar (check which one is the first element?) */}
              <span onClick={cycleThrough} className="absolute right-0 top-0  block md:hidden">
                <svg className="size-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z" fill="currentColor">
                  </path>
                </svg>
              </span>
            </div>
          </TripleBorder>
        </div>
      </div>
    </Layout>
  )
}