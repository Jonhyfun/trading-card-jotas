"use client";

import type { GameData, PlayerType } from "trading-card-jotas-types";
import { Card } from "@/components/Card";
import { type DeckCards, PlayerDeck } from "@/components/PlayerDeck";
import { type CardType, StackedCards } from "@/components/StackedCards";
import { useGameSocket } from "@/hooks/useGameSocket";
import { Layout } from "@/layout";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { ProfileSquare } from "@/components/ProfileSquare";
import { useCardModal } from "@/hooks/useCardModal";

export function Game({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { openCardModal } = useCardModal();
  // const { joinRoom, lockStance, placeCard, leaveRoom, gameData } =
  //   useGameSocket();

  const gameData = {} as GameData & PlayerType;

  const [selectedCard, setSelectedCard] = useState<CardType>();
  const [deck, setDeck] = useState<DeckCards | null>(null);

  const [myCards, setMyCards] = useState<CardType[]>([]);
  const [otherCards, setOtherCards] = useState<CardType[]>([]);

  const myStackRef = useRef<HTMLOListElement>(null);
  const otherStackRef = useRef<HTMLOListElement>(null);

  const handleCardPlacement = useCallback(
    (card: CardType) => {
      //lockStance();
      //placeCard(card.id);
      setSelectedCard(undefined);
    },
    [
      /*lockStance, placeCard*/
    ]
  );

  // useEffect(() => {
  //   setDeck(
  //     (gameData.hand ?? []).map(({ cardKey, id }) => ({
  //       id,
  //       cardKey,
  //       borderColor: "primary-light",
  //       src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`,
  //     }))
  //   );
  // }, [gameData.hand]);

  // useEffect(() => {
  //   setMyCards(
  //     gameData.myStack.map(({ cardKey, id }) => ({
  //       id,
  //       cardKey,
  //       src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`,
  //       borderColor: "primary-light",
  //     }))
  //   );
  // }, [gameData.myStack]);

  // useEffect(() => {
  //   setOtherCards(
  //     gameData.otherStack.map(({ cardKey, id }) => ({
  //       id,
  //       cardKey,
  //       src: `${process.env.NEXT_PUBLIC_API_URL}/cardImage/${cardKey}.png`,
  //       borderColor: "secondary-light",
  //     }))
  //   );
  // }, [gameData.otherStack]);

  useEffect(() => {
    myStackRef.current?.scroll(myStackRef.current?.scrollWidth, 0);
  }, [myCards]);

  useEffect(() => {
    otherStackRef.current?.scroll(otherStackRef.current?.scrollWidth, 0);
  }, [otherCards]);

  useEffect(() => {
    setDeck((current) => {
      if (!current) return current;
      return current.map((card) => ({
        ...card,
        borderColor: "primary-light",
        selected: card.id === selectedCard?.id,
      }));
    });
  }, [selectedCard]);

  // useEffect(() => {
  //   const deck = JSON.parse(window.localStorage.getItem("deck") ?? "[]");
  //   if (deck.length !== 20) {
  //     router.push("/");
  //   }
  //   if (router.isReady && router.query.gameId) {
  //     joinRoom(JSON.stringify({ room: router.query.gameId.toString(), deck }));
  //   }
  // }, [joinRoom, router]);

  // useEffect(() => {
  //   return () => {
  //     if (router.isReady) {
  //       leaveRoom(router.query.gameId!.toString());
  //     }
  //   };
  // }, [leaveRoom, router.isReady, router.query.gameId]);

  // if (!deck) {
  //   return (
  //     <Layout>
  //       <Loading />
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      {true /*|| gameData.gameState === "waitingForPlayers"*/ ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-xs pb-10 sm:text-base">
            <Loading text="Aguardando jogadores" />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col">
          <PlayerDeck playerSrc="/bowgor80.png" rival />
          <div
            className={`w-full h-full flex justify-between flex-col gap-2 pt-6 ${
              selectedCard ? "" : "pb-4"
            }`}
          >
            <div className="flex gap-3 items-center">
              <ProfileSquare
                borderColor={"secondary-light"}
                className="w-16 shrink-0 col-span-1"
                src={"/bowgor80.png"}
              />
              <StackedCards
                ref={otherStackRef}
                gameData={gameData}
                cardState={[otherCards, setOtherCards]}
                onCardClick={(card) =>
                  openCardModal(card.cardKey, card.borderColor)
                }
                selectedCard={
                  gameData.stance === "attack" ? selectedCard : undefined
                }
                onCardPlacement={handleCardPlacement}
                forStance="attack"
              />
              <span className="ml-auto">
                ({gameData.points.toString().replace(".", ",")})
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <ProfileSquare
                borderColor={"primary-light"}
                className="w-16 shrink-0 col-span-1"
                src={"/indio80.png"}
              />
              <StackedCards
                ref={myStackRef}
                gameData={gameData}
                cardState={[myCards, setMyCards]}
                onCardClick={(card) =>
                  openCardModal(card.cardKey, card.borderColor)
                }
                selectedCard={
                  gameData.stance === "defense" ? selectedCard : undefined
                }
                onCardPlacement={handleCardPlacement}
                forStance="defense"
              />
              <span className="ml-auto">
                ({gameData.points.toString().replace(".", ",")})
              </span>
            </div>
            {/**
             * //TODO setinha da alegria aqui se tiver uma carta selecionada (pro cara decidir a pilha)
             **/}
          </div>
          <div className="w-full flex items-start justify-end mb-2">
            {selectedCard && (
              <div
                onClick={() =>
                  openCardModal(
                    selectedCard!.cardKey,
                    selectedCard!.borderColor
                  )
                }
                className="h-[4.875rem] md:h-[6.75rem] cursor-pointer"
              >
                <Card
                  card={selectedCard!}
                  className="w-[2.356rem] h-[4.875rem] md:w-[3.625rem] md:h-[6.75rem]"
                />
              </div>
            )}
          </div>
          <PlayerDeck
            playerSrc="/indio80.png"
            deckState={[deck, setDeck]} //TODO nao vai atualizar kkkkkk (melhor extrair o state, paciencia)
            gameData={gameData}
            onCardClick={(card) => {
              setSelectedCard((current) =>
                current?.id === card.id ? undefined : card
              );
            }}
          />
        </div>
      )}
    </Layout>
  );
}
