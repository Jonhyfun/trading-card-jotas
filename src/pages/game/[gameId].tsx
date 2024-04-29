import { Card } from "@/components/Card";
import { DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { CardData, StackedCards } from "@/components/StackedCards";
import { TripleBorder } from "@/components/TripleBorder";
import { useModal } from "@/hooks/useModal";
import { useGameSocket } from "@/hooks/useGameSocket";
import { Layout } from "@/layout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { ProfileSquare } from "@/components/ProfileSquare";
import { BackendCard } from "@/hooks/useCards";

export default function Game() {
  const router = useRouter()
  const { joinRoom, lockStance, setCard, gameData } = useGameSocket();
  const { openModal } = useModal()
  const [selectedCard, setSelectedCard] = useState<CardData>()
  const [deck, setDeck] = useState<DeckCards | null>(null)
  
  const [myCards, setMyCards] = useState<CardData[]>([])
  const [otherCards, setOtherCards] = useState<CardData[]>([])

  const myStackRef = useRef<HTMLOListElement>(null)
  const otherStackRef = useRef<HTMLOListElement>(null)

  const handleCardPlacement = useCallback((card: CardData) => {
    lockStance()
    setCard(card.id)
    setSelectedCard(undefined)
  },[lockStance, setCard])

  //TODO hookar
  const handleCardClick = (card: CardData & BackendCard) => {
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
              {card.desc}
            </span>
          </TripleBorder>
        </div>
      )
    })
  }

  useEffect(() => {
    setDeck((gameData.hand ?? []).map(({card, id}) => ({id, borderColor: 'primary-light', src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${card}`})))
  },[gameData.hand])

  useEffect(() => {
    setMyCards(gameData.myStack.map(({card, id}) => (
      {id, src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${card}`, borderColor: 'primary-light'}
    )))
  },[gameData.myStack])

  useEffect(() => {
    myStackRef.current?.scroll(myStackRef.current?.scrollWidth, 0);
  },[myCards])

  useEffect(() => {
    setOtherCards(gameData.otherStack.map(({card, id}) => (
      {id, src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${card}`, borderColor: 'secondary-light'}
    )))
  },[gameData.otherStack])

  useEffect(() => {
    otherStackRef.current?.scroll(otherStackRef.current?.scrollWidth, 0);
  },[otherCards])

  useEffect(() => {
    setDeck((current) => {
      if(!current) return current
      return current.map((card) => ({...card, borderColor: 'primary-light', selected: card.id === selectedCard?.id}))
    })
  },[selectedCard])

  useEffect(() => {
    const deck = JSON.parse(window.localStorage.getItem('deck') ?? '[]')
    console.log({deck})
    if(deck.length !== 20) {
      router.push('/')
    }
    if(router.isReady && router.query.gameId) {
      joinRoom(JSON.stringify({room: router.query.gameId.toString(), deck}))
    }
  },[joinRoom, router])

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
        <div className={`w-full h-full flex justify-between flex-col gap-2 pt-6 ${selectedCard ? '' : 'pb-4'}`}>
          <div className="flex gap-3 items-center">
            <ProfileSquare borderColor={"secondary-light"} className="w-16 shrink-0 col-span-1" src={'/bowgor80.png'}/>
            <StackedCards
              ref={otherStackRef}
              cardState={[otherCards, setOtherCards]}
              onCardClick={(card) => handleCardClick(card)}
              gutterMultiplication={25}
              reverse
              selectedCard={gameData.stance === 'attack' ? selectedCard : undefined}
              onCardPlacement={handleCardPlacement}
            />
            <span className="ml-auto">({gameData.otherPoints.toString().replace('.', ',')})</span>
          </div>
          <div className="flex gap-3 items-center">
            <ProfileSquare borderColor={"primary-light"} className="w-16 shrink-0 col-span-1" src={'/indio80.png'}/>
            <StackedCards
              ref={myStackRef}
              cardState={[myCards, setMyCards]}
              onCardClick={(card) => handleCardClick(card)}
              gutterMultiplication={25}
              reverse
              selectedCard={gameData.stance === 'defense' ? selectedCard : undefined}
              onCardPlacement={handleCardPlacement}
            />
            <span className="ml-auto">({gameData.myPoints.toString().replace('.', ',')})</span>
          </div>
          {/**
           * //TODO setinha da alegria aqui se tiver uma carta selecionada (pro cara decidir a pilha) 
          **/}
        </div>
        <div className="w-full flex items-start justify-end mb-2">
          {selectedCard && (
            <div onClick={() => handleCardClick(selectedCard)} className="h-[4.875rem] md:h-[6.75rem] cursor-pointer">
              <Card card={selectedCard} className="w-[2.356rem] h-[4.875rem] md:w-[3.625rem] md:h-[6.75rem]"/>
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