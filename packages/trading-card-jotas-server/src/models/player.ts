import type { ConnectedSocket } from "@/states/socket";
import type {
  Cards,
  DeckCard,
  PlayerEffects,
  PlayerType,
} from "trading-card-jotas-types/cards/types";
import { makeId, shuffle } from "@/utils/random";
import { Room } from "./room";
import { validDeck } from "@/utils/game/deck/validations";
import { Points } from "./points";
import { Stack } from "./stack";

export class Player implements PlayerType {
  socket: ConnectedSocket;
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
    this.socket = ws;
    this.uid = ws.uid;
    this.stance = _stance;
  }

  getPoints() {
    return this.#points.getPoints;
  }

  calculatePoints() {
    return this.#points.calculatePoints;
  }

  onJoinRoom(room: Room) {
    this.socket.onclose = () => {
      room.leave(this);
    };
    this.#room = room;
    this.socket.send(`setStance/${this.socket.player.stance}`);
    this.socket.send("joinedRoom");
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

      console.log(`${this.socket.uid} loaded the deck on the socket`);
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
