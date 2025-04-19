import type { GameData } from "trading-card-jotas-types";
import type { DisplayCardType } from "./StackedCards";
import Link from "next/link";
import { useMemo } from "react";
import { ProfileSquare } from "./ProfileSquare";
import { TripleBorder } from "./TripleBorder";
import { Card } from "./Card";
import { noop } from "@/utils";

export type DeckCards = (DisplayCardType & {
  selected?: boolean;
})[];

type PlayerDeckProps = {
  playerSrc: string;
  gameData?: GameData;
  deck: DeckCards;
  rival?: boolean;
  onCardClick?: (card: DisplayCardType) => void;
};

export function PlayerDeck({
  playerSrc,
  gameData,
  onCardClick = noop,
  deck: _deck,
  rival = false,
}: PlayerDeckProps) {
  const deck = useMemo(
    () =>
      rival
        ? Array.from({ length: 5 }).map(
            (_, i) =>
              ({
                borderColor: "secondary-light",
                id: i.toString(),
                src: "",
              }) as DeckCards[number]
          )
        : _deck,
    [_deck, rival]
  );

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
        {gameData?.state === "victory" || gameData?.state === "defeat" ? (
          <div className="h-[4.75rem] px-2 py-5">
            <Link href="/" className="group cursor-pointer">
              <span className="group-hover:visible invisible mr-2">*</span>
              <span>Voltar</span>
            </Link>
          </div>
        ) : (
          <div className="md:flex relative md:gap-0.5 md:justify-start items-center justify-center flex-wrap w-full h-[4.75rem] grid grid-cols-5 gap-1 overflow-y-hidden overflow-x-auto md:overflow-y-visible md:overflow-visible">
            {deck.map((card) => (
              <div
                key={`${card.id}-inventory`}
                onClick={() => onCardClick(card)}
                className={`${
                  card.selected ? "md:-translate-y-3 -translate-y-1" : ""
                } md:px-1 py-1 px-0 h-full flex items-center cursor-pointer md:hover:-translate-y-3 hover:-translate-y-1`}
              >
                <div className="min-w-12 w-12 h-[4.25rem] block">
                  <Card className="text-xs" card={card} facingDown={rival} />
                </div>
              </div>
            ))}
          </div>
        )}
      </TripleBorder>
    </div>
  );
}
