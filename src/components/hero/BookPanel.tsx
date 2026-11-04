import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BOOK_ORDER, BOOK_BY_ID } from '../../data/books';
import { useCovers } from '../../lib/covers';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from '../ui/icons';

interface BookPanelProps {
  bookId: number | null;
  onClose: () => void;
  onNavigate: (id: number) => void;
}

function nextBookId(current: number, direction: 1 | -1): number {
  const index = BOOK_ORDER.indexOf(current);
  if (index === -1) return BOOK_ORDER[0];
  const next = (index + direction + BOOK_ORDER.length) % BOOK_ORDER.length;
  return BOOK_ORDER[next];
}

export function BookPanel({ bookId, onClose, onNavigate }: BookPanelProps) {
  const { byId } = useCovers();
  const windowRef = useRef<HTMLDivElement>(null);
  const open = bookId !== null;

  useScrollLock(open);
  useFocusTrap(windowRef, open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'ArrowRight' && bookId !== null) {
        onNavigate(nextBookId(bookId, 1));
      }
      if (event.key === 'ArrowLeft' && bookId !== null) {
        onNavigate(nextBookId(bookId, -1));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [bookId, onNavigate, open]);

  const book = bookId !== null ? BOOK_BY_ID.get(bookId) ?? null : null;
  const cover = bookId !== null ? byId.get(bookId) : undefined;
  const volumeNumber = book ? BOOK_ORDER.indexOf(book.id) + 1 : 0;

  const handleInternalLink = (href: string) => {
    if (!href.startsWith('#')) return false;
    onClose();
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return true;
  };

  return (
    <AnimatePresence>
      {open && book ? (
        <div className="overlay" key="book-panel">
          <motion.div
            className="overlay__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={windowRef}
            className="overlay__window book-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-panel-title"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overlay__bar">
              <span className="overlay__label">
                Volume {String(volumeNumber).padStart(2, '0')} / 32
              </span>
              <button
                type="button"
                className="icon-btn !h-9 !w-9 border-0"
                onClick={onClose}
                aria-label="Close book details"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <div className="book-panel__body">
              <div className="book-panel__visual">
                {cover ? (
                  <img src={cover.dataUrl} alt={`Cover of ${book.title}`} />
                ) : null}
              </div>

              <div className="book-panel__content">
                <div className="book-panel__kind">
                  <span>{book.kind}</span>
                  <span>{book.eyebrow}</span>
                </div>
                <h2 className="book-panel__title" id="book-panel-title">
                  {book.title}
                </h2>
                <p className="book-panel__subtitle">{book.subtitle}</p>
                <p className="book-panel__description">{book.description}</p>

                <div className="book-panel__stack" aria-label="Technologies">
                  {book.stack.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="book-panel__actions">
                  {book.link ? (
                    <a
                      className="btn btn-outline"
                      href={book.link.href}
                      target={book.link.href.startsWith('#') ? undefined : '_blank'}
                      rel={book.link.href.startsWith('#') ? undefined : 'noreferrer'}
                      onClick={(event) => {
                        if (handleInternalLink(book.link!.href)) {
                          event.preventDefault();
                        }
                      }}
                    >
                      {book.link.label}
                      {book.link.href.startsWith('#') ? (
                        <ArrowRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </a>
                  ) : null}

                  <div className="book-panel__nav">
                    <span className="book-panel__count">
                      {String(volumeNumber).padStart(2, '0')} / 32
                    </span>
                    <button
                      type="button"
                      className="icon-btn !h-9 !w-9"
                      onClick={() => onNavigate(nextBookId(book.id, -1))}
                      aria-label="Previous volume"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn !h-9 !w-9"
                      onClick={() => onNavigate(nextBookId(book.id, 1))}
                      aria-label="Next volume"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-5 text-[10px] leading-relaxed text-muted">
                  Use the arrow keys to move between volumes. Press Escape to
                  return to the shelf.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
