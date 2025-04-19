import type { ConnectedSocket } from "@/states/socket";
import type {
  Cards,
  DeckCard,
  PlayerEffects,
  PlayerType,
} from "trading-card-jotas-types";
import { makeId, shuffle } from "@/utils/random";
import { Room } from "./room";
import { validDeck } from "@/utils/game/deck/validations";
import { Points } from "./points";
import { Stack } from "./stack";
import { PlayerSocket } from "./socket";

export class Player implements PlayerType {
  socket: PlayerSocket;
  uid: ConnectedSocket["uid"];

  hand!: DeckCard[];
  #initial_deck!: DeckCard[];
  deck!: DeckCard[];
  effects: PlayerEffects[] = [];

  stance: "attack" | "defense";
  stack = new Stack(this);

  #points = new Points(this);

  #room!: Room;

  constructor(ws: ConnectedSocket, _stance = "attack" as typeof this.stance) {
    this.uid = ws.uid;
    this.stance = _stance;
    this.socket = new PlayerSocket(ws, this);
  }

  getPoints() {
    return this.#points.getPoints();
  }

  calculatePoints() {
    return this.#points.calculatePoints();
  }

  getRoomId() {
    return this.#room.id;
  }

  onJoinRoom(room: Room) {
    this.#room = room;
    this.socket.handleRoomJoin(() => {
      room.leave(this);
    });
  }

  placeCard(cardId: DeckCard["id"]) {
    if (!this.#room.game.currentSetCards[this.uid]) {
      const pickedCardIndex = this.hand.findIndex(({ id }) => cardId === id);

      if (pickedCardIndex > -1) {
        const pickedCard = this.hand.splice(pickedCardIndex, 1)[0];

        if (pickedCard) {
          this.#room.game.currentSetCards[this.uid] = pickedCard;
          this.#room.game.onCardPlaced(this.uid);
        }
      }
    }
  }

  dispatchDeck(deck: Cards[]) {
    if (!this.hand && !this.#initial_deck) {
      this.#initial_deck = [];

      if (!validDeck(deck)) {
        throw new Error("Invalid deck!");
      }

      deck.forEach((cardKey, i) => {
        this.#initial_deck.push({ cardKey, id: `${i}-${makeId(8)}` });
      });

      console.log(`${this.uid} loaded the deck on the socket`);
    }
  }

  dealHand(size = 5) {
    this.hand = this.deck.splice(0, size);
  }

  shuffleDeck() {
    shuffle(this.deck);
    //SRP this.socket.send(`loadHand/${JSON.stringify(this.hand)}`);
  }

  loadDeck() {
    this.deck = this.#initial_deck.map((deckCard) => deckCard);
    this.shuffleDeck();
  }
}
