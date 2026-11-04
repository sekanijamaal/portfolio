import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.36) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}
