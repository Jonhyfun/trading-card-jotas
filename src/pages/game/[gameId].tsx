import { Card } from "@/components/Card";
import { DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { CardData, StackedCards } from "@/components/StackedCards";
import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { Layout } from "@/layout";
import { mockCards } from "@/utils";
import { useEffect, useRef, useState } from "react";

export default function Game() {
  const {openModal} = useModal()
  const [selectedCard, setSelectedCard] = useState<CardData>()
  const [deck, setDeck] = useState<DeckCards>(mockCards.map((card) => ({...card, borderColor: 'primary-light'})))

  const defenseStackRef = useRef<HTMLOListElement>(null)
  const attackStackRef = useRef<HTMLOListElement>(null)

  //? Era melhor as stacks serem uma grid reversa (não existe, teria que ser um flex [o que também não ia dar certo, porisso o grid kkkkk]) pra scrollarem na direção "correta" automáticamente quando tiverem novos conteúdos dentro
  const scrollStacks = () => {
    if(defenseStackRef.current && attackStackRef.current) {
      console.log('rodei')
      defenseStackRef.current.scroll(defenseStackRef.current.scrollWidth, 0)
      attackStackRef.current.scroll(attackStackRef.current.scrollWidth, 0)
    }
  }

  //TODO pedir as cartas com os sockets
  const handleCardClick = (card: CardData) => {
    openModal({
      borderColor: card.borderColor,
      children: (
        <div className="w-[16rem] h-[20rem] p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
          <TripleBorder borderColor="gray-light">
            <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
              <img className="w-full h-full" style={{imageRendering: 'pixelated'}} src={card.src}/>
            </div>
          </TripleBorder>
          <TripleBorder borderColor="gray-light">
            <span className="text-xs p-3 w-full h-[6.75rem] overflow-y-auto block leading-5 bg-bg-internal text-black">
              Esta carta tem o efeito de fazer alguma coisa acontecer.
            </span>
          </TripleBorder>
        </div>
      )
    })
  }

  useEffect(() => {
    setDeck(mockCards.map((card) => ({...card, borderColor: 'primary-light', selected: card.id === selectedCard?.id})))
  },[selectedCard])

  return (
    <Layout>
      <div className="h-full w-full flex flex-col">
        <PlayerDeck playerSrc="/bowgor80.png" rival/>
        <div className="w-full h-full flex justify-between flex-col pt-6 pb-4">
          <StackedCards
            ref={attackStackRef}
            cards={mockCards.map((card) => ({...card, borderColor: 'secondary-light'}))}
            onCardClick={(card) => handleCardClick(card)}
            gutterMultiplication={25}
            reverse
            selectedCard={selectedCard}
            onCardPlacement={() => setSelectedCard(undefined)}
          />
          <StackedCards
            ref={defenseStackRef}
            cards={mockCards.map((card) => ({...card, borderColor: 'primary-light'}))}
            onCardClick={(card) => handleCardClick(card)}
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
            <div onClick={() => handleCardClick(selectedCard)} className="h-[6.75rem] cursor-pointer">
              <Card card={selectedCard} className="w-[3.625rem] h-[6.75rem]"/>
            </div>
          )}
        </div>
        <PlayerDeck
          playerSrc="/indio80.png"
          deckState={[deck, setDeck]} //TODO nao vai atualizar kkkkkk (melhor extrair o state, paciencia)
          onCardClick={(card) => {
            setSelectedCard((current) => (current?.id === card.id ? undefined : card))
          }}
        />
      </div>
    </Layout>
  )
}