import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../data/site';
import { SKILL_GROUPS } from '../data/skills';
import { CERTIFICATIONS } from '../data/certifications';
import { PROJECTS } from '../data/projects';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Close, Printer } from './ui/icons';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);

  return (
    <AnimatePresence>
      {open ? (
        <div className="overlay" key="resume">
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
            ref={ref}
            className="overlay__window resume resume-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overlay__bar">
              <span className="overlay__label">Curriculum vitae — {site.portfolioYear}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline !min-h-9 !px-3 !py-1.5 !text-[9px]"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print / PDF
                </button>
                <button
                  type="button"
                  className="icon-btn !h-9 !w-9 border-0"
                  onClick={onClose}
                  aria-label="Close resume"
                >
                  <Close className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overlay__scroll resume-sheet__body p-[clamp(24px,4vw,52px)]">
              <div className="resume__head">
                <div>
                  <h2 className="resume__name" id="resume-title">
                    {site.name}
                  </h2>
                  <p className="resume__role">{site.role}</p>
                </div>
                <div className="resume__contact">
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <a href={site.github} target="_blank" rel="noreferrer">
                    github.com/sidneyodum
                  </a>
                  <a href={site.linkedin} target="_blank" rel="noreferrer">
                    linkedin.com/in/sidneyodum
                  </a>
                </div>
              </div>

              <section className="resume__section">
                <h3 className="resume__section-title">Profile</h3>
                <p className="body-copy !text-[12.5px]">
                  Software developer and AWS Certified Solutions Architect with a
                  background in Animal Biology and Conservation Sciences. I work
                  across backend development, frontend engineering, cloud
                  infrastructure, and application deployment — turning ideas into
                  reliable, well-considered digital products.
                </p>
              </section>

              <section className="resume__section">
                <h3 className="resume__section-title">Certifications</h3>
                <div className="resume__grid">
                  {CERTIFICATIONS.map((certification) => (
                    <div key={certification.id}>
                      <div className="resume__item-title">{certification.name}</div>
                      <div className="resume__item-meta">
                        {certification.issuer} · {certification.level}
                      </div>
                      <p className="resume__item-copy">{certification.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="resume__section">
                <h3 className="resume__section-title">Technical expertise</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  {SKILL_GROUPS.map((group) => (
                    <div key={group.index}>
                      <div className="resume__item-title !text-[15px]">{group.title}</div>
                      <div className="resume__tags mt-2">
                        {group.items.map((item) => (
                          <span className="chip" key={item}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="resume__section">
                <h3 className="resume__section-title">Selected projects</h3>
                <div className="resume__grid">
                  {PROJECTS.map((project) => (
                    <div key={project.id}>
                      <div className="resume__item-title">{project.name}</div>
                      <div className="resume__item-meta">
                        {project.category} · {project.status}
                      </div>
                      <p className="resume__item-copy">{project.summary}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="resume__section">
                <h3 className="resume__section-title">Background</h3>
                <p className="resume__item-copy">
                  A foundation in Animal Biology and Conservation Sciences, followed
                  by self-directed study across Python, the web, databases, and cloud
                  infrastructure. Practical work on real products — AHOME, AGLF, and
                  NAAB — has been the ongoing classroom. AWS certifications widened
                  the focus from applications to the systems they run in.
                </p>
              </section>

              <p className="resume__foot">
                Credential verification, project references, and further detail
                available on request. This resume reflects the information published
                on this portfolio; it is not a record of employment.
              </p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
