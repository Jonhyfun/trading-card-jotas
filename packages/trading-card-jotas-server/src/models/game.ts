import * as cards from "trading-card-jotas-types/cards";
import type { ConnectedSocket } from "@/states/socket";
import type { DeckCard } from "trading-card-jotas-types/cards/types";
import { deleteRoom, getRooms } from "@/states/room";
import { Player } from "./player";
import { handlePointsSum } from "@/game/points";
import { handleVisualEffects } from "@/game/visual";

export class Game<Players extends Record<ConnectedSocket["uid"], Player>> {
  players: Players;
  currentSetCards!: Record<keyof Players, DeckCard | undefined>;

  constructor(_players: Players) {
    this.players = _players;
  }

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
      (attackingPlayer.points.slice(-1)?.[0] ?? 0) >
      (defendingPlayer.points.slice(-1)?.[0] ?? 0);
    const defenseWins =
      (defendingPlayer.points.slice(-1)?.[0] ?? 0) >
      (attackingPlayer.points.slice(-1)?.[0] ?? 0);

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

  #revealCards() {
    const { attackingPlayer, defendingPlayer } = this.#getStancedPlayers();

    const firstPendingEffect = attackingPlayer.pendingEffects.shift(); //TODO some sort of effects engine
    if (firstPendingEffect) firstPendingEffect();

    const secondPendingEffect = defendingPlayer.pendingEffects.shift();
    if (secondPendingEffect) secondPendingEffect();

    const logicalCards = [
      {
        id: attackingPlayer.stack.slice(-1)[0].id,
        card: cards[attackingPlayer.stack.slice(-1)[0].cardKey].default,
        owner: attackingPlayer,
      },
      {
        id: defendingPlayer.stack.slice(-1)[0].id,
        card: cards[defendingPlayer.stack.slice(-1)[0].cardKey].default,
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
      firstCardOwner.stack.slice(-1)[0].id === secondCardId ||
      secondCardOwner.stack.slice(-1)[0].id === firstCardId
    )
      secondCard.effect(firstCardOwner, secondCardOwner);
    else secondCard.effect(secondCardOwner, firstCardOwner);

    const attackingPlayerStack = attackingPlayer.stack.map(
      ({ cardKey }) => cards[cardKey].default
    );
    const defendingPlayerStack = defendingPlayer.stack.map(
      ({ cardKey }) => cards[cardKey].default
    );

    attackingPlayer.points.push(
      handlePointsSum(attackingPlayer, attackingPlayerStack)
    );
    defendingPlayer.points.push(
      handlePointsSum(defendingPlayer, defendingPlayerStack)
    );

    const currentAttackingGlobal = attackingPlayer.globalEffects.shift();
    const currentDefendingGlobal = defendingPlayer.globalEffects.shift();

    [attackingPlayer, defendingPlayer].forEach((player) => {
      const nextCard = player.deck.splice(0, 1)?.[0];

      if (
        !(
          currentAttackingGlobal === "sendRepeatedTurn" ||
          currentDefendingGlobal === "sendRepeatedTurn"
        )
      ) {
        player.stance = player.stance === "attack" ? "defense" : "attack";
      }

      if (nextCard) {
        player.hand.push(nextCard);
      }

      player.socket.send(`setStance/${player.stance}`);
      player.socket.send(`loadHand/${JSON.stringify(player.hand)}`);
      player.socket.send(`loadMyStack/${JSON.stringify(player.stack)}`); //TODO juntar todos esses 6 sends?
      player.socket.send(
        `loadMyPoints/${player.points.slice(-1)[0].toFixed(2)}`
      );
    });

    handleVisualEffects(attackingPlayer, attackingPlayerStack); //TODO where will visualEffects be? maybe another class altogether
    handleVisualEffects(defendingPlayer, defendingPlayerStack);

    attackingPlayer.socket.send(
      `loadOtherStack/${JSON.stringify(defendingPlayer.stack)}`
    ); //TODO dry?
    defendingPlayer.socket.send(
      `loadOtherStack/${JSON.stringify(attackingPlayer.stack)}`
    );

    attackingPlayer.socket.send(
      `loadVisualEffects/${JSON.stringify(attackingPlayer.cardVisualEffects)}`
    );
    defendingPlayer.socket.send(
      `loadVisualEffects/${JSON.stringify(defendingPlayer.cardVisualEffects)}`
    );

    attackingPlayer.socket.send(
      `loadOtherVisualEffects/${JSON.stringify(
        defendingPlayer.cardVisualEffects
      )}`
    );
    defendingPlayer.socket.send(
      `loadOtherVisualEffects/${JSON.stringify(
        attackingPlayer.cardVisualEffects
      )}`
    );

    attackingPlayer.socket.send(
      `loadOtherPoints/${(defendingPlayer.points.slice(-1)[0] ?? 0).toFixed(2)}`
    );
    defendingPlayer.socket.send(
      `loadOtherPoints/${(attackingPlayer.points.slice(-1)[0] ?? 0).toFixed(2)}`
    );

    if (
      attackingPlayer.hand.length === 0 ||
      defendingPlayer.hand.length === 0
    ) {
      this.#triggerVictory();
    }
  }

  #getStacks(playerId: keyof Players) {
    const player = this.players[playerId];
    const otherId = (Object.keys(this.players) as (keyof Players)[]).find(
      (id) => id !== playerId
    );

    if (!otherId) throw new Error("There must be 2 non-spectator players!");

    const otherPlayer = this.players[otherId];

    const focusedStack =
      player.stance === "attack" ? otherPlayer.stack : player.stack;

    const otherStack =
      player.stance === "defense" ? otherPlayer.stack : player.stack;

    return { focusedStack, otherStack };
  }

  placeCard(playerId: keyof Players, card: DeckCard) {
    const player = this.players[playerId];
    if (!this.currentSetCards[playerId]) {
      this.currentSetCards[playerId] = card;

      const roomPlayers = getRooms()[player.socket.room];
      const otherPlayer = roomPlayers.find(({ uid }) => uid !== player.uid);

      if (!otherPlayer) return player.socket.send("error/Sala vazia!");

      if (roomPlayers.every((player) => this.currentSetCards[player.uid])) {
        const { focusedStack, otherStack } = this.#getStacks(playerId);

        focusedStack.push(
          this.currentSetCards[player.uid as keyof Players] as DeckCard
        );
        otherStack.push(
          this.currentSetCards[otherPlayer.uid as keyof Players] as DeckCard
        );

        this.currentSetCards[player.uid as keyof Players] = undefined;
        this.currentSetCards[otherPlayer.uid as keyof Players] = undefined;

        return this.#revealCards();
      }
    }
  }
}
