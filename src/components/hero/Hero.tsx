import { lazy, Suspense, useRef } from 'react';
import { site } from '../../data/site';
import { BOOKS } from '../../data/books';
import { useCovers } from '../../lib/covers';
import type { PointerState } from '../three/BookScene';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { ArrowRight, Check, Spark } from '../ui/icons';

const BookScene = lazy(() => import('../three/BookScene'));

interface HeroProps {
  onSelectBook: (id: number) => void;
  onOpenLibrary: () => void;
  selectedBookId: number | null;
}

const fallbackIds = [1, 0, 7, 10, 3, 16, 18];

export function Hero({ onSelectBook, onOpenLibrary, selectedBookId }: HeroProps) {
  const { covers, byId, ready, failed, progress } = useCovers();
  const reducedMotion = usePrefersReducedMotion();
  const coarse = useMediaQuery('(pointer: coarse)');
  const webgl = useWebGLSupport();
  const pointer = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
    lastMove: 0,
  });

  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    pointer.current.active = true;
    pointer.current.lastMove = performance.now();
  };

  const stopPointer = () => {
    pointer.current.active = false;
  };

  const showScene = webgl && ready && covers.length === BOOKS.length;

  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={trackPointer}
      onPointerDown={trackPointer}
      onPointerLeave={stopPointer}
      onPointerCancel={stopPointer}
    >
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__name-layer shell">
        <h1 id="hero-title" className="hero__name hero-anim-name">
          <span className="hero__name-first">Sidney</span>
          <span className="hero__name-last">Odum</span>
        </h1>
      </div>

      <div className="hero__canvas" aria-hidden="true">
        {showScene ? (
          <Suspense fallback={null}>
            <BookScene
              covers={covers}
              selectedId={selectedBookId}
              onSelect={onSelectBook}
              pointer={pointer}
              reducedMotion={reducedMotion}
              coarse={coarse}
            />
          </Suspense>
        ) : null}
      </div>

      <div className="shell hero__inner">
        <div className="hero__top">
          <div>
            <p className="eyebrow hero-anim" style={{ '--delay': '0.1s' } as React.CSSProperties}>
              {site.role}
            </p>
            <p
              className="hero-anim mt-5 max-w-[21ch] font-serif text-[clamp(1.3rem,2.2vw,1.85rem)] leading-[1.25] text-ink"
              style={{ '--delay': '0.2s' } as React.CSSProperties}
            >
              I build software products and the cloud systems behind them.
            </p>
          </div>

          <div
            className="hero__aside hero-anim"
            style={{ '--delay': '0.32s' } as React.CSSProperties}
          >
            <p>{site.description}</p>
            <div className="hero__actions">
              <a className="btn btn-solid" href="#projects">
                Explore my work
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a className="btn btn-outline" href="#contact">
                Let&apos;s connect
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted">
              <Spark className="h-2.5 w-2.5 text-champagne" />
              32 volumes in the library
            </p>
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__meta">
            <ul className="hero__certs" aria-label="Certifications">
              {site.credentials.map((credential) => (
                <li key={credential}>
                  <Check className="h-3 w-3" />
                  <span>{credential}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onOpenLibrary}
                className="link-slide text-[10px] uppercase tracking-[0.18em] text-soft transition-colors hover:text-champagne"
              >
                Browse the library
                <ArrowRight className="h-3 w-3" />
              </button>
              <span className="hero__scroll" aria-hidden="true">
                <span className="hero__scroll-line" />
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>

      {!showScene && !failed ? (
        <div className="hero__loader" role="status" aria-live="polite">
          <div className="hero__loader-inner">
            <span>Preparing the library</span>
            <span className="hero__loader-track">
              <span style={{ width: `${Math.max(8, progress)}%` }} />
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>
      ) : null}

      {ready && !webgl ? (
        <div className="fallback" aria-label="Static book library preview">
          <p className="fallback__note">
            The interactive shelf needs WebGL. The full library is still
            available in a list, and every volume can be opened.
          </p>
          <div className="fallback__shelf">
            {fallbackIds.map((id) => {
              const cover = byId.get(id);
              const book = BOOKS[id];
              if (!cover || !book) return null;
              return (
                <button
                  type="button"
                  key={id}
                  className="fallback__book"
                  onClick={() => onSelectBook(id)}
                  aria-label={`Open ${book.title}`}
                >
                  <img src={cover.dataUrl} alt="" loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
