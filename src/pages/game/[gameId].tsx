import { Card } from "@/components/Card";
import { DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { CardData, StackedCards } from "@/components/StackedCards";
import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { Layout } from "@/layout";
import { mockCards } from "@/utils";
import { useEffect, useState } from "react";

export default function Game() {
  const {openModal} = useModal()
  const [selectedCard, setSelectedCard] = useState<CardData>()
  const [deck, setDeck] = useState<DeckCards>(mockCards.map((card) => ({...card, borderColor: 'primary-light'})))

  useEffect(() => {
    setDeck(mockCards.map((card) => ({...card, borderColor: 'primary-light', selected: card.id === selectedCard?.id})))
  },[selectedCard])

  const handleCardClick = (borderColor: TripleBorderProps['borderColor'], card: CardData) => {
    openModal({
      borderColor,
      children: (
        <div className="w-[16rem] h-[20rem] p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
          <TripleBorder borderColor="gray-light">
            <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
              <img className="w-full h-full" style={{imageRendering: 'pixelated'}} src={card.src}/>
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
        <PlayerDeck playerSrc="/bowgor80.png" rival/>
        <div className="w-full h-full flex justify-around items-start md:pt-12 pt-6">
          <StackedCards
            cards={mockCards.map((card) => ({...card, borderColor: 'primary-light'}))}
            onCardClick={(card) => handleCardClick("primary-light", card)}
            gutterMultiplication={25}
            reverse
            selectedCard={selectedCard}
            onCardPlacement={() => setSelectedCard(undefined)}
          />
          <StackedCards
            cards={mockCards.map((card) => ({...card, borderColor: 'secondary-light'}))}
            onCardClick={(card) => handleCardClick("secondary-light", card)}
            gutterMultiplication={25}
            reverse
            selectedCard={selectedCard}
            onCardPlacement={() => setSelectedCard(undefined)}
          />
          {/**
           * //TODO setinha da alegria aqui se tiver uma carta selecionada (pro cara decidir a pilha) 
          **/}
        </div>
        <div className="w-full flex items-start justify-end mb-2">
          {selectedCard && (
            <div onClick={() => handleCardClick("primary-light", selectedCard)} className="w-[4rem] h-[5.25rem] cursor-pointer z-10">
              <Card card={selectedCard} />
            </div>
          )}
        </div>
        <PlayerDeck
          playerSrc="/indio80.png"
          deckState={[deck, setDeck]} //TODO nao vai atualizar kkkkkk (melhor extrair o state, paciencia)
          onCardClick={setSelectedCard}
        />
      </div>
    </Layout>
  )
}