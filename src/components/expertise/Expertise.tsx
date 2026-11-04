import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKILL_GROUPS } from '../../data/skills';
import { BOOK_BY_ID } from '../../data/books';
import { useCovers } from '../../lib/covers';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, Plus } from '../ui/icons';

interface ExpertiseProps {
  onSelectBook: (id: number) => void;
}

export function Expertise({ onSelectBook }: ExpertiseProps) {
  const { byId } = useCovers();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [previewIndex, setPreviewIndex] = useState(0);

  const previewGroup = SKILL_GROUPS[previewIndex] ?? SKILL_GROUPS[0];
  const previewBook = BOOK_BY_ID.get(previewGroup.bookId);
  const previewCover = byId.get(previewGroup.bookId);

  return (
    <section id="expertise" className="section" aria-labelledby="expertise-heading">
      <div className="shell">
        <SectionHeading
          index="03"
          label="Expertise"
          id="expertise-heading"
          title={
            <>
              A toolkit for building{' '}
              <span className="text-champagne">end to end.</span>
            </>
          }
          lead="Four disciplines, one practice. The stack is a means to an end: software that is useful, sensible to operate, and pleasant to use."
        />

        <div className="expertise-layout">
          <div className="expertise-preview" data-reveal>
            <div>
              <button
                type="button"
                className="expertise-preview__frame group block w-full cursor-pointer"
                onClick={() => onSelectBook(previewGroup.bookId)}
                aria-label={`Open the ${previewBook?.title ?? 'expertise'} volume`}
              >
                <AnimatePresence initial={false} mode="wait">
                  {previewCover ? (
                    <motion.img
                      key={previewCover.id}
                      src={previewCover.dataUrl}
                      alt={`Cover of ${previewBook?.title ?? 'selected volume'}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transform: 'rotate(-1.5deg)' }}
                    />
                  ) : null}
                </AnimatePresence>
                <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-[0.2em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Open volume
                </span>
              </button>

              <div className="expertise-preview__caption">
                <span>Vol. {String(previewIndex + 1).padStart(2, '0')} — Field notes</span>
                <span className="inline-flex items-center gap-1.5 text-champagne">
                  {previewBook?.kind ?? 'Expertise'}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>

          <div className="expertise-list" data-reveal data-delay="0.08">
            {SKILL_GROUPS.map((group, index) => {
              const isOpen = openIndex === index;
              const panelId = `expertise-panel-${index}`;
              const triggerId = `expertise-trigger-${index}`;

              return (
                <div
                  className="expertise-row"
                  key={group.index}
                  onMouseEnter={() => setPreviewIndex(index)}
                >
                  <button
                    type="button"
                    className="expertise-row__trigger"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onFocus={() => setPreviewIndex(index)}
                    onClick={() => {
                      setPreviewIndex(index);
                      setOpenIndex(isOpen ? null : index);
                    }}
                  >
                    <span className="expertise-row__index">{group.index}</span>
                    <span className="expertise-row__title">{group.title}</span>
                    <span className="expertise-row__icon" aria-hidden="true">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        className="expertise-row__panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="expertise-row__panel-inner">
                          <p className="expertise-row__blurb">{group.blurb}</p>
                          <div className="expertise-row__items">
                            {group.items.map((item) => (
                              <span className="chip" key={item}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
