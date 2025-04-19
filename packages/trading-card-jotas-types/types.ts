import * as cards from "./cards/index";

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

export type GameState = "waitingForPlayers" | "running" | "victory" | "defeat";

export type GameData = {
  id: string;
  state: GameState;
  players: 0 | 1 | 2;
  spectators?: number;
};

export interface PlayerSyncData
  extends Pick<PlayerType, "hand" | "effects" | "stance"> {
  stack: DeckCard[];
  points: string;
}

interface SocketEventsDefinition {
  error: { message: string; redirectPath?: string };
  matchStatus: { status: GameState; message?: string };
  redirect: { path: string };
  syncData: PlayerSyncData;
}

export type SocketEvents = keyof SocketEventsDefinition;
export type SocketEventData<T extends SocketEvents> = SocketEventsDefinition[T];
