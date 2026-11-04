import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Progressive scroll choreography for the editorial sections.
 * Everything is opt-in through [data-reveal]; the hero owns its own intro.
 */
export function useScrollReveals(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        const delay = Number(element.dataset.delay ?? 0);
        gsap.fromTo(
          element,
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.05,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-line]').forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        const strength = Number(element.dataset.parallax || 0.08);
        gsap.fromTo(
          element,
          { yPercent: -strength * 100 },
          {
            yPercent: strength * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement ?? element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [reducedMotion]);
}
