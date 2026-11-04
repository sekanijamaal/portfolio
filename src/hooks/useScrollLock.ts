import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = '';
let previousPadding = '';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return undefined;
    const body = document.body;

    if (lockCount === 0) {
      previousOverflow = body.style.overflow;
      previousPadding = body.style.paddingRight;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPadding;
      }
    };
  }, [active]);
}
