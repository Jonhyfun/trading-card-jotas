import type { ConnectedSocket } from "@/states/socket";
import type {
  Cards,
  DeckCard,
  PlayerData,
} from "trading-card-jotas-types/cards/types";
import { makeId, shuffle } from "@/utils/random";

export class Player implements PlayerData {
  socket: ConnectedSocket;
  uid: ConnectedSocket["uid"];

  hand!: DeckCard[];
  #initial_deck!: DeckCard[];
  deck!: DeckCard[];

  points: number[] = [];
  stack!: DeckCard[];
  stance!: "attack" | "defense";

  constructor(ws: ConnectedSocket) {
    this.socket = ws;
    this.uid = ws.uid;
  }

  dispatchDeck(deck: Cards[]) {
    if (!this.hand) {
      if (this.#initial_deck && this.#initial_deck.length) {
        this.#initial_deck = [];
        deck.forEach((cardKey, i) => {
          this.#initial_deck.push({ cardKey, id: `${i}-${makeId(8)}` });
        });
        console.log(`${this.socket.uid} carregou o deck no socket`);
      }
    }
  }

  shuffleDeck() {
    if (this.hand && this.deck?.length && this.hand.length === 0) {
      this.deck = this.#initial_deck.map((deckCard) => deckCard);
      shuffle(this.deck);
      this.hand = this.deck.splice(0, 5);
    } else {
      throw new Error("Cant shuffle deck during play!");
    }
    //SRP this.socket.send(`loadHand/${JSON.stringify(this.hand)}`);
  }
}
