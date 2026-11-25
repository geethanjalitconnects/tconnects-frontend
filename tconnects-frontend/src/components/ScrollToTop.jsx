import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top every time the route changes
 * (or the same link is clicked again), so pages never open
 * at the old scroll position.
 * Links with a #hash (e.g. /#hero) are left alone so they can
 * scroll to their own target.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, key]);

  return null;
}