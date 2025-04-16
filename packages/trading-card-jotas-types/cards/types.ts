import * as cards from "./index";

export type Cards = keyof typeof cards;

export interface DeckCard {
  cardKey: Cards;
  id: string;
}

export interface UserData {
  hand: DeckCard[];
  ingameDeck: DeckCard[];
  deck: DeckCard[];
  points: (number | null)[];
  cardStack: DeckCard[];
  cardVisualEffects: ("overwritten" | "copied" | "ghost")[];
  hiddenCards: DeckCard["id"][];
  currentSetCard?: DeckCard;
  globalEffects: ("invertedOdds" | "sendRepeatedTurn")[];
  pendingEffects: (() => void)[];
  room: string | null;
  stance: "attack" | "defense";
}

export interface CardData {
  label: string;
  value: number | null;
  ghost?: boolean;
  operation?: string;
  desc?: string;
  priority?: 1 | 2;
  limit: 1 | 2 | 3;
  modifyPreviousCard?: (card: CardData) => CardData;
  effect: (cardOwner: UserData, otherPlayer: UserData) => void;
}
