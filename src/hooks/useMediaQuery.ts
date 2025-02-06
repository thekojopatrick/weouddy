"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to monitor media query changes.
 *
 * @param query - The media query string to evaluate (e.g., "(min-width: 768px)").
 * @returns A boolean indicating whether the media query matches.
 */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}
