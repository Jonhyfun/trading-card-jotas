import * as cards from "./index";

export type Cards = keyof typeof cards;

export interface DeckCard {
  cardKey: Cards;
  id: string;
}

export type Stance = "attack" | "defense";

export interface PlayerData {
  uid: string;
  hand: DeckCard[];
  deck: DeckCard[];
  points: number[];
  stack: DeckCard[];
  stance: Stance;
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
  effect: (cardOwner: PlayerData, otherPlayer: PlayerData) => void;
}
