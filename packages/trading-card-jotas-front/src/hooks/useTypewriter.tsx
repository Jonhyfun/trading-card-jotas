"use client";

import { useEffect, useRef, useState } from "react";

export function useTypewriter(text: string, delay: number) {
  const initialText = useRef(text);
  const [delayedText, setDelayedText] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDelayedText((current) => {
        if (current.length + 1 === initialText.current.length) {
          clearInterval(interval);
          return initialText.current;
        }
        return initialText.current.slice(0, current.length + 1);
      });
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return delayedText;
}
