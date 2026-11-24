import { useEffect } from 'react';

/* position: sticky silently stops working when any parent has overflow: hidden.
   `overflow: clip` hides overflow the same way without making the parent a scroll container.
   (Same trick the homepage uses. <html> and <body> are skipped on purpose.) */
export default function useStickyFix(ref) {
  useEffect(() => {
    const undo = [];
    for (let el = ref.current && ref.current.parentElement; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      const cs = getComputedStyle(el);
      ['overflowX', 'overflowY'].forEach((k) => {
        if (cs[k] === 'hidden') {
          const prop = k === 'overflowX' ? 'overflow-x' : 'overflow-y';
          const old = el.style.getPropertyValue(prop);
          el.style.setProperty(prop, 'clip');
          undo.push(() => el.style.setProperty(prop, old));
        }
      });
    }
    return () => undo.forEach((f) => f());
  }, [ref]);
}