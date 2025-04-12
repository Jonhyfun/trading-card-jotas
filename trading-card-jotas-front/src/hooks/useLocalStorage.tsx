import { useCallback, useEffect, useState } from "react";
import { useGameSocket } from "./useGameSocket";

export const useLocalStorage = () => {
  //const { saveDeck } = useGameSocket()
  const [localDeck, setLocalDeck] = useState<string[]>();

  const postLocalDeck = useCallback((deck: string[], withMessage = false) => {
    if (deck.length !== 20) return;
    window.localStorage.setItem("deck", JSON.stringify(deck));
    //saveDeck(deck, withMessage)
  }, []);

  const onLocalStorageChange = useCallback((e: StorageEvent) => {
    if (e.newValue) {
      const deck = JSON.parse(e.newValue);
      if (deck && deck.length && deck.length === 20) {
        setLocalDeck(deck);
      }
    } else {
      setLocalDeck(undefined);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", onLocalStorageChange);

    () => {
      window.removeEventListener("storage", onLocalStorageChange);
    };
  }, [onLocalStorageChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localDeckString = window.localStorage.getItem("deck");
    if (localDeckString) {
      const parsedLocalDeck = JSON.parse(localDeckString);
      setLocalDeck(parsedLocalDeck);
      //saveDeck(parsedLocalDeck)
    }
  }, []);

  return { postLocalDeck, localDeck };
};
