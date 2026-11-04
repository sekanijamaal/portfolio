import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BOOK_ORDER, BOOK_BY_ID, type BookKind } from '../../data/books';
import { useCovers } from '../../lib/covers';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Close } from '../ui/icons';

type Filter = 'All' | 'Projects' | 'Expertise' | 'Experiments';

interface LibraryIndexProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
}

const filters: Filter[] = ['All', 'Projects', 'Expertise', 'Experiments'];

const matches = (kind: BookKind, filter: Filter): boolean => {
  if (filter === 'All') return true;
  if (filter === 'Projects') return kind === 'Project';
  if (filter === 'Expertise') return kind === 'Expertise';
  return kind === 'Experiment' || kind === 'Future';
};

export function LibraryIndex({ open, onClose, onSelect }: LibraryIndexProps) {
  const { byId } = useCovers();
  const [filter, setFilter] = useState<Filter>('All');
  const windowRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(windowRef, open, onClose);

  const volumes = useMemo(
    () =>
      BOOK_ORDER.map((id) => BOOK_BY_ID.get(id)).filter(
        (book): book is NonNullable<typeof book> => Boolean(book),
      ),
    [],
  );

  const visible = volumes.filter((book) => matches(book.kind, filter));

  const choose = (id: number) => {
    onSelect(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="overlay" key="library">
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
            className="overlay__window library"
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overlay__bar">
              <span className="overlay__label">S.O. Press — complete catalogue</span>
              <button
                type="button"
                className="icon-btn !h-9 !w-9 border-0"
                onClick={onClose}
                aria-label="Close the library"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <div className="library__head">
              <div>
                <h2 className="library__title" id="library-title">
                  The complete library
                </h2>
                <span className="library__count">
                  {visible.length} {visible.length === 1 ? 'volume' : 'volumes'} · Every cover is an original
                </span>
              </div>

              <div className="library__filters" role="group" aria-label="Filter volumes">
                {filters.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="library__filter"
                    aria-pressed={filter === item}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="library__scroll">
              <div className="library__grid">
                {visible.map((book, index) => {
                  const cover = byId.get(book.id);
                  const order = BOOK_ORDER.indexOf(book.id) + 1;
                  return (
                    <motion.button
                      type="button"
                      key={book.id}
                      className="library__item"
                      onClick={() => choose(book.id)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index * 0.02, 0.35),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      aria-label={`Open ${book.title}, volume ${order}`}
                    >
                      <span className="library__cover">
                        {cover ? (
                          <img src={cover.dataUrl} alt="" loading="lazy" />
                        ) : null}
                      </span>
                      <span className="library__item-title">{book.title}</span>
                      <span className="library__item-kind">
                        Vol. {String(order).padStart(2, '0')} · {book.kind}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {visible.length === 0 ? (
                <p className="library__empty">No volumes in this category yet.</p>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
