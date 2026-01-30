"use client";

import { useCallback, useRef } from "react";

type Options = {
  taps: number;
  windowMs: number;
};

export function useRapidTapTrigger(
  onTrigger: () => void,
  options: Options = { taps: 5, windowMs: 2000 },
) {
  const timestampsRef = useRef<number[]>([]);

  const onTap = useCallback(() => {
    const now = Date.now();

    timestampsRef.current = timestampsRef.current
      .filter((t) => now - t <= options.windowMs)
      .concat(now);

    if (timestampsRef.current.length >= options.taps) {
      timestampsRef.current = [];
      onTrigger();
    }
  }, [onTrigger, options.taps, options.windowMs]);

  return { onTap };
}
