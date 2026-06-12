import { useEffect, useState } from "react";

const STORAGE_KEY = "roulette_last_shown";
const COOLDOWN_HOURS = 3;

export function useRouletteAutoOpen() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let shouldOpen = false;
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      if (!last) {
        shouldOpen = true;
      } else {
        const hours = (Date.now() - Number(last)) / 3_600_000;
        shouldOpen = hours >= COOLDOWN_HOURS;
      }
    } catch {
      shouldOpen = false; // 사파리 프라이빗 등 localStorage 비활성 시
    }

    if (shouldOpen) {
      setIsOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* noop */
      }
    }
  }, []);

  return [isOpen, setIsOpen];
}