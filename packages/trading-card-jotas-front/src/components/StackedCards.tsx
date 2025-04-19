import {
  type Dispatch,
  type ForwardedRef,
  type MutableRefObject,
  type SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { TripleBorderProps } from "./TripleBorder";
import type { DeckCard, GameData } from "trading-card-jotas-types";
import { Card } from "./Card";
import { errorToast } from "@/utils/toast";
import { useCards } from "@/hooks/useCards";

//todo Matematica Man

export interface DisplayCardType extends DeckCard {
  src: string;
  borderColor: Exclude<TripleBorderProps["borderColor"], undefined>;
}

type StackedCardsProps = {
  cardState: [DisplayCardType[], Dispatch<SetStateAction<DisplayCardType[]>>];
  forStance?: "attack" | "defense";
  selectedCard?: DisplayCardType;
  onCardPlacement?: (card: DisplayCardType) => void;
  onCardClick?: (card: DisplayCardType) => void;
  gameData: GameData;
};

export const StackedCards = forwardRef(
  (
    {
      cardState,
      onCardClick,
      onCardPlacement,
      selectedCard,
      gameData,
      forStance,
    }: StackedCardsProps,
    ref: ForwardedRef<HTMLOListElement>
  ) => {
    const { cards: cardsData } = useCards();
    const [cards, setCards] = cardState;
    const [hoveredCardId, setHoveredCardId] = useState<
      DisplayCardType["id"] | undefined
    >();

    //const visualEffects = useMemo(
    //  () =>
    //    forStance === "defense"
    //      ? gameData.visualEffects
    //      : gameData.otherVisualEffects,
    //  [forStance, gameData.otherVisualEffects, gameData.visualEffects]
    //);

    const handleCardPlacement = useCallback(() => {
      if (selectedCard) {
        setCards((current) => [...current, selectedCard]);
        if (onCardPlacement) onCardPlacement(selectedCard);
      } else {
        errorToast("Selecione sua carta primeiro!");
      }
    }, [onCardPlacement, selectedCard, setCards]);

    useEffect(() => {
      //? O ref ta vindo de fora por que acho que embreve ele vai triggar esse scroll em resposta à uma mensagem do socket.
      const stackRef = ref as MutableRefObject<HTMLOListElement>;
      if (selectedCard && stackRef.current) {
        stackRef.current.scroll(stackRef.current.scrollWidth, 0);
      }
    }, [ref, selectedCard]);

    return (
      <ol
        ref={ref}
        style={{ gridAutoFlow: "column" }}
        className="grid grid-cols-[repeat(auto-fit,_minmax(3.875rem,_3.875rem))] md:grid-cols-[repeat(auto-fit,_minmax(4.875rem,_4.875rem))] gap-0.5 overflow-x-auto w-full"
      >
        {cards.map((card, i) => (
          <li
            key={`${card.id}-stack-${forStance}-${card.borderColor}`}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(undefined)}
            className={`relative cursor-pointer ${
              hoveredCardId !== undefined && hoveredCardId !== card.id
                ? "opacity-25"
                : ""
            }`}
          >
            <button
              className="w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem]"
              onClick={onCardClick ? () => onCardClick(card) : undefined}
            >
              <Card borderColor={card.borderColor} card={card} />
            </button>
            {cardsData.find(({ key }) => key === card.cardKey)?.ghost ? (
              <div
                style={{
                  background: `url(${process.env.NEXT_PUBLIC_API_URL}/visualEffects/ghost.png)`,
                }}
                className="absolute bg-center bg-contain bg-no-repeat top-0 right-0 w-1/2 h-1/2 opacity-65"
                onClick={onCardClick ? () => onCardClick(card) : undefined}
              ></div>
            ) : (
              <>
                {/*visualEffects[i] && (
                  <div
                    style={{
                      background: `url(${process.env.NEXT_PUBLIC_API_URL}/visualEffects/${visualEffects[i]}.png)`,
                    }}
                    className={`absolute bg-center bg-contain bg-no-repeat ${
                      visualEffects[i] === "overwritten"
                        ? "top-0 left-0 w-full h-full"
                        : "top-0 right-0 w-1/2 h-1/2"
                    } opacity-65`}
                    onClick={onCardClick ? () => onCardClick(card) : undefined}
                  ></div>
                )*/}
              </>
            )}
          </li>
        ))}
        {gameData.state === "running" && (
          /* gameData.stance === forStance &&*/ <li className="w-[3.875rem] md:w-[4.875rem] h-[5.325rem] md:h-[6.75rem] group relative">
            <div className="absolute top-0 left-0 border-dashed border-2 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] bg-bg-internal bg-opacity-45 cursor-pointer" />
            <button
              onClick={handleCardPlacement}
              className="absolute top-0 left-0 w-[3.875rem] h-[5.325rem] md:w-[4.875rem] md:h-[6.75rem] invisible group-hover:visible opacity-45"
            >
              {selectedCard && (
                <Card
                  borderColor={selectedCard.borderColor}
                  card={selectedCard}
                  className="w-full"
                />
              )}
            </button>
          </li>
        )}
      </ol>
    );
  }
);
