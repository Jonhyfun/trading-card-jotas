import { Card } from "@/components/Card";
import { DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { CardData, StackedCards } from "@/components/StackedCards";
import { useGameSocket } from "@/hooks/useGameSocket";
import { Layout } from "@/layout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { ProfileSquare } from "@/components/ProfileSquare";
import { useCardModal } from "@/hooks/useCardModal";

export default function Game() {
  const router = useRouter()
  const { openCardModal } = useCardModal()
  const { joinRoom, lockStance, placeCard, leaveRoom, gameData } = useGameSocket();

  const [selectedCard, setSelectedCard] = useState<CardData>()
  const [hand, setHand] = useState<DeckCards | null>(null)

  const [myCards, setMyCards] = useState<CardData[]>([])
  const [otherCards, setOtherCards] = useState<CardData[]>([])

  const myStackRef = useRef<HTMLDivElement>(null)
  const otherStackRef = useRef<HTMLDivElement>(null)

  const handleCardPlacement = useCallback((card: CardData) => {
    lockStance()
    placeCard(card.id)
    setSelectedCard(undefined)
  }, [lockStance, placeCard])

  useEffect(() => {
    setHand((gameData.me.hand ?? []).map(({ cardKey, id, ...rest }) => ({
      id,
      cardKey,
      borderColor: 'primary-light',
      src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`,
      ...rest
    })))
  }, [gameData.me.hand])

  useEffect(() => {
    setMyCards(gameData.me.cardStack.map(({ cardKey, id, ...rest }) => (
      { id, cardKey, src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`, borderColor: 'primary-light', ...rest }
    )))
  }, [gameData.me.cardStack])

  useEffect(() => {
    setOtherCards(gameData.otherPlayer.cardStack.map(({ cardKey, id, ...rest }) => (
      { id, cardKey, src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`, borderColor: 'secondary-light', ...rest }
    )))
  }, [gameData.otherPlayer.cardStack])

  useEffect(() => {
    myStackRef.current?.scroll(myStackRef.current?.scrollWidth, 0);
  }, [myCards])

  useEffect(() => {
    otherStackRef.current?.scroll(otherStackRef.current?.scrollWidth, 0);
  }, [otherCards])

  useEffect(() => {
    setHand((current) => {
      if (!current) return current
      return current.map((card) => ({ ...card, borderColor: 'primary-light', selected: card.id === selectedCard?.id }))
    })
  }, [selectedCard])

  useEffect(() => {
    const deck = JSON.parse(window.localStorage.getItem('deck') ?? '[]')
    if (deck.length !== 20) {
      router.push('/')
    }
    if (router.isReady && router.query.gameId) {
      joinRoom(JSON.stringify({ room: router.query.gameId.toString(), deck }))
    }
  }, [joinRoom, router])

  useEffect(() => {
    return () => {
      if (router.isReady) {
        leaveRoom(router.query.gameId!.toString())
      }
    }
  }, [leaveRoom, router.isReady, router.query.gameId])

  if (!hand) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout noPadding={gameData.gameState !== 'waitingForPlayers'}>
      {gameData.gameState === 'waitingForPlayers' ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-xs pb-10 sm:text-base">
            <Loading text="Aguardando jogadores" />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col">
          <div className="px-2 pt-2">
            <PlayerDeck playerSrc="/bowgor80.png" rival />
          </div>
          <div className={`w-full h-full flex flex-col gap-4 justify-around `}>
            <div className="flex flex-col gap-3 items-center bg-gray-light pb-2 border-solid border-gray border-t-[1px] border-b-[1px]">
              <div className="ml-auto flex gap-2 w-full items-center p-2">
                <ProfileSquare borderColor={"secondary-light"} className="w-16 shrink-0 col-span-1" src={'/bowgor80.png'} />
                <span className="w-28">({Number(gameData.otherPlayer.points).toFixed(2).replace('.', ',').replace(',00', '')})</span>
              </div>
              <StackedCards
                ref={otherStackRef}
                sidePadding={"0.5rem"}
                gameData={gameData}
                cardState={[otherCards, setOtherCards]}
                onCardClick={(card) => openCardModal(card.cardKey, card.borderColor)}
                selectedCard={gameData.me.stance === 'attack' ? selectedCard : undefined}
                onCardPlacement={handleCardPlacement}
                forStance="attack"
              />
            </div>
            <div className="flex gap-3 flex-col items-center bg-gray-light pb-2 border-solid border-gray border-t-[1px] border-b-[1px]">
              <div className="flex gap-2 w-full items-center p-2">
                <ProfileSquare borderColor={"primary-light"} className="w-16 shrink-0 col-span-1" src={'/indio80.png'} />
                <span className="w-28">({Number(gameData.me.points).toFixed(2).replace('.', ',').replace(',00', '')})</span>
              </div>
              <StackedCards
                ref={myStackRef}
                sidePadding={"0.5rem"}
                gameData={gameData}
                cardState={[myCards, setMyCards]}
                onCardClick={(card) => openCardModal(card.cardKey, card.borderColor)}
                selectedCard={gameData.me.stance === 'defense' ? selectedCard : undefined}
                onCardPlacement={handleCardPlacement}
                forStance="defense"
              />
            </div>
            {/**
           * //TODO setinha da alegria aqui se tiver uma carta selecionada (pro cara decidir a pilha) 
          **/}
          </div>
          <div className="px-2 pb-2">
            <PlayerDeck
              playerSrc="/indio80.png"
              deckState={[hand, setHand]}
              gameData={gameData}
              onCardClick={(card) => {
                openCardModal(card.cardKey, card.borderColor)
                //setSelectedCard((current) => (current?.id === card.id ? undefined : card))
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}