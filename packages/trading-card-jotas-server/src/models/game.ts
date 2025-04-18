import * as cards from "trading-card-jotas-types/cards";
import type {
  DeckCard,
  PlayerSyncData,
} from "trading-card-jotas-types/cards/types";
import type { ConnectedSocket } from "@/states/socket";
import { deleteRoom } from "@/states/room";
import { Player } from "./player";

type Players = Record<ConnectedSocket["uid"], Player>;

export class Game {
  players: Players = {};
  currentSetCards!: Record<keyof Players, DeckCard | undefined>;

  #getStancedPlayers() {
    let attackingPlayer!: Player;
    let defendingPlayer!: Player;

    for (const player of Object.values(this.players)) {
      if (player.stance == "attack") {
        attackingPlayer = player;
      } else if (player.stance == "defense") {
        defendingPlayer = player;
      }
    }

    return { attackingPlayer, defendingPlayer };
  }

  #triggerVictory() {
    const { attackingPlayer, defendingPlayer } = this.#getStancedPlayers();
    const attackWins =
      attackingPlayer.getPoints() > defendingPlayer.getPoints();
    const defenseWins =
      defendingPlayer.getPoints() > attackingPlayer.getPoints();

    attackingPlayer.socket.send(
      `${attackWins ? "endWining" : "endLosing"}/${
        attackWins ? "Você venceu!" : "Você perdeu..."
      }`
    );
    defendingPlayer.socket.send(
      `${defenseWins ? "endWining" : "endLosing"}/${
        defenseWins ? "Você venceu!" : "Você perdeu..."
      }`
    );

    deleteRoom(attackingPlayer.socket.room);
  }

  #getStacks(playerId: keyof Players) {
    const player = this.players[playerId];
    const otherId = (Object.keys(this.players) as (keyof Players)[]).find(
      (id) => id !== playerId
    );

    if (!otherId) throw new Error("There must be 2 non-spectator players!");

    const otherPlayer = this.players[otherId];

    const ownerStack =
      player.stance === "attack" ? otherPlayer.stack.cards : player.stack.cards;

    const otherStack =
      player.stance === "defense"
        ? otherPlayer.stack.cards
        : player.stack.cards;

    return { ownerStack, otherStack };
  }

  #revealCards() {
    const { attackingPlayer, defendingPlayer } = this.#getStancedPlayers();

    // const firstPendingEffect = attackingPlayer.pendingEffects.shift(); //TODO some sort of effects engine
    // if (firstPendingEffect) firstPendingEffect();

    // const secondPendingEffect = defendingPlayer.pendingEffects.shift();
    // if (secondPendingEffect) secondPendingEffect();

    const logicalCards = [
      {
        id: attackingPlayer.stack.cards.slice(-1)[0].id,
        card: cards[attackingPlayer.stack.cards.slice(-1)[0].cardKey].default,
        owner: attackingPlayer,
      },
      {
        id: defendingPlayer.stack.cards.slice(-1)[0].id,
        card: cards[defendingPlayer.stack.cards.slice(-1)[0].cardKey].default,
        owner: defendingPlayer,
      },
    ];

    const [{ card: firstCard, owner: firstCardOwner, id: firstCardId }] =
      logicalCards
        .sort((a, b) => (b.card.priority ?? 0) - (a.card.priority ?? 0))
        .splice(0, 1);

    const [{ card: secondCard, owner: secondCardOwner, id: secondCardId }] =
      logicalCards.splice(0, 1);

    firstCard.effect(firstCardOwner, secondCardOwner);

    //? Se depois do primeiro efeito o dono das cartas trocou, troca a ordem dos argumentos do efeito pra refletir isso (RIP POO)
    if (
      firstCardOwner.stack.cards.slice(-1)[0].id === secondCardId ||
      secondCardOwner.stack.cards.slice(-1)[0].id === firstCardId
    )
      secondCard.effect(firstCardOwner, secondCardOwner);
    else secondCard.effect(secondCardOwner, firstCardOwner);

    attackingPlayer.calculatePoints();
    defendingPlayer.calculatePoints();

    const currentAttackerEffect = attackingPlayer.effects.shift();
    const currentDefenderEffect = defendingPlayer.effects.shift();

    [attackingPlayer, defendingPlayer].forEach((player) => {
      const nextCard = player.deck.splice(0, 1)?.[0];

      if (
        !(
          currentAttackerEffect === "keepStance" ||
          currentDefenderEffect === "keepStance"
        )
      ) {
        player.stance = player.stance === "attack" ? "defense" : "attack";
      }

      if (nextCard) {
        player.hand.push(nextCard);
      }

      // player.socket.send(`setStance/${player.stance}`);
      // player.socket.send(`loadHand/${JSON.stringify(player.hand)}`);
      // player.socket.send(`loadMyStack/${JSON.stringify(player.stack.cards)}`); //TODO juntar todos esses 6 sends?
      // player.socket.send(
      //   `loadMyPoints/${player.points.slice(-1)[0].toFixed(2)}`
      // );
    });

    attackingPlayer.stack.handleVisualEffects();
    defendingPlayer.stack.handleVisualEffects();

    // attackingPlayer.socket.send(
    //   `loadOtherStack/${JSON.stringify(defendingPlayer.stack.cards)}`
    // ); //TODO dry?
    // defendingPlayer.socket.send(
    //   `loadOtherStack/${JSON.stringify(attackingPlayer.stack.cards)}`
    // );

    // attackingPlayer.socket.send(
    //   `loadVisualEffects/${JSON.stringify(attackingPlayer.cardVisualEffects)}`
    // );
    // defendingPlayer.socket.send(
    //   `loadVisualEffects/${JSON.stringify(defendingPlayer.cardVisualEffects)}`
    // );

    // attackingPlayer.socket.send(
    //   `loadOtherVisualEffects/${JSON.stringify(
    //     defendingPlayer.cardVisualEffects
    //   )}`
    // );
    // defendingPlayer.socket.send(
    //   `loadOtherVisualEffects/${JSON.stringify(
    //     attackingPlayer.cardVisualEffects
    //   )}`
    // );

    // attackingPlayer.socket.send(
    //   `loadOtherPoints/${(defendingPlayer.points.slice(-1)[0] ?? 0).toFixed(2)}`
    // );
    // defendingPlayer.socket.send(
    //   `loadOtherPoints/${(attackingPlayer.points.slice(-1)[0] ?? 0).toFixed(2)}`
    // );

    this.syncData();

    if (
      attackingPlayer.hand.length === 0 ||
      defendingPlayer.hand.length === 0
    ) {
      this.#triggerVictory();
    }
  }

  onCardPlaced(ownerId: keyof Game["players"]) {
    const roomPlayers = Object.values(this.players);
    const otherPlayer = roomPlayers.find(({ uid }) => uid !== ownerId);

    if (!otherPlayer) {
      this.currentSetCards[ownerId] = undefined;
      return roomPlayers[0].socket.send("error/Sala vazia!");
    }

    if (roomPlayers.every((player) => this.currentSetCards[player.uid])) {
      const { ownerStack, otherStack } = this.#getStacks(ownerId);

      ownerStack.push(
        this.currentSetCards[ownerId as keyof Players] as DeckCard
      );
      otherStack.push(
        this.currentSetCards[otherPlayer.uid as keyof Players] as DeckCard
      );

      this.currentSetCards[ownerId as keyof Players] = undefined;
      this.currentSetCards[otherPlayer.uid as keyof Players] = undefined;

      return this.#revealCards();
    }
  }

  syncData() {
    Object.values(this.players).forEach((player) => {
      player.socket.send(
        `syncData/${JSON.stringify({
          points: player.getPoints().toString(),
          hand: player.hand,
          stack: player.stack.cards,
          stance: player.stance,
          effects: player.effects,
        } as PlayerSyncData)}`
      );
    });
  }
}
