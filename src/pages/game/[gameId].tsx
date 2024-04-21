import { Card } from "@/components/Card";
import { DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { CardData, StackedCards } from "@/components/StackedCards";
import { TripleBorder } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { useGameSocket } from "@/hooks/useGameSocket";
import { Layout } from "@/layout";
import { mockCards } from "@/utils/any";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Game() {
  const router = useRouter()
  const {localDeck} = useLocalStorage()
  const { joinRoom, lockStance, setCard, gameData } = useGameSocket();
  const { openModal } = useModal()
  const [selectedCard, setSelectedCard] = useState<CardData>()
  const [deck, setDeck] = useState<DeckCards | null>(null)

  const defenseStackRef = useRef<HTMLOListElement>(null)
  const attackStackRef = useRef<HTMLOListElement>(null)

  const handleCardPlacement = useCallback((card: CardData) => {
    lockStance()
    setCard(card.id)
    setSelectedCard(undefined)
  },[lockStance, setCard])

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
    setDeck((current) => {
      if(!current) return current
      return gameData.hand.map(({card, id}) => ({borderColor: 'primary-light', src: `http://localhost/cardImage/${card}`, id}))
    })
  },[gameData.hand])

  useEffect(() => {
    setDeck((current) => {
      if(!current) return current
      return current.map((card) => ({...card, borderColor: 'primary-light', selected: card.id === selectedCard?.id}))
    })
  },[selectedCard])

  useEffect(() => {
    if(!localDeck) {
      router.push('/')
    }
    if(router.isReady && router.query.gameId) {
      //TODO localdeck pode trocar
      joinRoom(JSON.stringify({room: router.query.gameId.toString(), deck: localDeck}))
    }
  },[joinRoom, localDeck, router])

  if(!deck) {
    return (
      <Layout>
        <Loading/>
      </Layout>
    )
  }

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
            selectedCard={gameData.stance === 'attack' ? selectedCard : undefined}
            onCardPlacement={handleCardPlacement}
          />
          <StackedCards
            ref={defenseStackRef}
            cards={mockCards.map((card) => ({...card, borderColor: 'primary-light'}))}
            onCardClick={(card) => handleCardClick(card)}
            gutterMultiplication={25}
            reverse
            selectedCard={gameData.stance === 'defense' ? selectedCard : undefined}
            onCardPlacement={handleCardPlacement}
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