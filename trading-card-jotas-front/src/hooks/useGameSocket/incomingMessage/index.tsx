import type { Player } from "trading-card-jotas-types";

const success = (data: string) => {};

const error = (data: string) => {};

const setGameState = (data: string) => {};

const endLosing = (data: string) => {};

const endWining = (data: string) => {};

const setStance = (stance: Player["stance"]) => {};

const loadHand = (_hand: string) => {};

const loadMyStack = (_myStack: string) => {};

const loadOtherStack = (_otherStack: string) => {};

const loadVisualEffects = (_visualEffects: string) => {};

const loadOtherVisualEffects = (_otherVisualEffects: string) => {};

const loadMyPoints = (_myPoints: string) => {};

const loadOtherPoints = (_otherPoints: string) => {};

const joinedRoom = async () => {};

export {
  success,
  error,
  setGameState,
  endLosing,
  endWining,
  setStance,
  loadHand,
  loadMyStack,
  loadOtherStack,
  loadVisualEffects,
  loadOtherVisualEffects,
  loadMyPoints,
  loadOtherPoints,
  joinedRoom,
};
