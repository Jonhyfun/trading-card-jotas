import type { GameData } from "trading-card-jotas-types";
import { Dispatch, SetStateAction, useState } from "react";
import { ProfileSquare } from "./ProfileSquare";
import { CardData } from "./StackedCards";
import { TripleBorder } from "./TripleBorder";
import { Card } from "./Card";
import Link from "next/link";

export type DeckCards = (CardData & {
  selected?: boolean;
})[];

type PlayerDeckProps = {
  playerSrc: string;
  gameData?: GameData;
  deckState?: [DeckCards | null, Dispatch<SetStateAction<DeckCards | null>>];
  rival?: boolean;
  onCardClick?: (card: CardData) => void;
};

export function PlayerDeck({
  playerSrc,
  gameData,
  onCardClick = () => {},
  deckState: _deckState,
  rival = false,
}: PlayerDeckProps) {
  const deckState = useState<DeckCards>([]);
  const [deck, setDeck] = _deckState ?? deckState;

  return (
    <div
      className={`w-full flex gap-2 items-center ${
        rival ? "flex-row-reverse" : ""
      } md:gap-4`}
    >
      <ProfileSquare
        borderColor={rival ? "secondary-light" : "primary-light"}
        className="w-16 md:w-24 shrink-0 col-span-1"
        src={playerSrc}
        reverse={rival}
      />
      <TripleBorder borderColor="gray-light" className="w-full">
        {gameData?.state === "victory" || gameData?.state === "loss" ? (
          <div className="h-[4.75rem] px-2 py-5">
            <Link href="/" className="group cursor-pointer">
              <span className="group-hover:visible invisible mr-2">*</span>
              <span>Voltar</span>
            </Link>
          </div>
        ) : (
          <div className="md:flex relative md:gap-0.5 md:justify-start items-center justify-center flex-wrap w-full h-[4.75rem] grid grid-cols-5 gap-1 overflow-y-hidden overflow-x-auto md:overflow-y-visible md:overflow-visible">
            {(rival
              ? Array.from({ length: 5 }).map(
                  (_, i) =>
                    ({
                      borderColor: "secondary-light",
                      id: i.toString(),
                      src: "",
                    } as DeckCards[number])
                )
              : deck ?? []
            ).map((card) => (
              <div
                key={`${card.id}-inventory`}
                onClick={() => onCardClick(card as CardData)}
                className={`${
                  card.selected ? "md:-translate-y-3 -translate-y-1" : ""
                } md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-3 hover:-translate-y-1`}
              >
                <div className="min-w-12 w-12 h-[4.25rem] block">
                  <Card
                    className="text-xs"
                    card={card as CardData}
                    facingDown={rival}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </TripleBorder>
    </div>
  );
}
