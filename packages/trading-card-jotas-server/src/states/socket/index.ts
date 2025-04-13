import { DeckCard } from "@/cards/types";

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

export type ConnectedSocket = WebSocket &
  UserData & {
    uid: string;
  };

type SocketsType = { [key in string]: ConnectedSocket };
let sockets: SocketsType = {};

export const deleteSocket = (room: string) => {
  delete sockets[room];
};

export const setSockets = (setter: (current: SocketsType) => SocketsType) => {
  sockets = setter(sockets);
};

export const getSocket = (uid: string) => sockets[uid];
