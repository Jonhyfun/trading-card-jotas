import * as cards from "./index";

export type Cards = keyof typeof cards;

export interface DeckCard {
  cardKey: Cards;
  id: string;
}

export type VisualEffects = "overwritten" | "copied" | "ghost";
export type PlayerEffects = "keepStance";
export type Stance = "attack" | "defense";

export interface StackType {
  cards: DeckCard[];
  visualEffects: Record<string, VisualEffects>;
}

export interface PlayerType {
  uid: string;
  hand: DeckCard[];
  deck: DeckCard[];
  effects: PlayerEffects[];
  stack: StackType;
  stance: Stance;
}

export interface CardType {
  label: string;
  value: number | null;
  ghost?: boolean;
  operation?: string;
  desc?: string;
  priority?: 1 | 2;
  limit: 1 | 2 | 3;
  modifyPreviousCard?: (card: CardType) => CardType;
  effect: (cardOwner: PlayerType, otherPlayer: PlayerType) => void;
}

export type PlayerSyncData = Pick<PlayerType, "hand" | "effects" | "stance"> & {
  stack: DeckCard[];
  points: string;
};
