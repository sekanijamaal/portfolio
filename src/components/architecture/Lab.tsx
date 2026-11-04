import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EXPERIMENTS } from '../../data/architecture';
import { site } from '../../data/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Diagram } from './Diagram';
import { ArrowUpRight } from '../ui/icons';

export function Lab() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const experiment = EXPERIMENTS[active];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next = active;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (active + 1) % EXPERIMENTS.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (active - 1 + EXPERIMENTS.length) % EXPERIMENTS.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = EXPERIMENTS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Architecture notes — ${experiment.title}`,
  )}`;

  return (
    <section id="lab" className="section lab" aria-labelledby="lab-heading">
      <div className="shell">
        <SectionHeading
          index="04"
          label="Architecture lab"
          id="lab-heading"
          title={
            <>
              Beyond the <span className="text-champagne">interface.</span>
            </>
          }
          lead="Working notes on cloud engineering: reference architectures, Terraform experiments, delivery pipelines, and the decisions that sit underneath an application. These are studies and works in progress, not claims of production scale."
        />

        <div className="lab-layout">
          <div
            className="lab-tabs"
            role="tablist"
            aria-label="Architecture experiments"
            onKeyDown={handleKeyDown}
          >
            {EXPERIMENTS.map((item, index) => (
              <button
                type="button"
                key={item.id}
                role="tab"
                id={`lab-tab-${item.id}`}
                aria-selected={active === index}
                aria-controls={`lab-panel-${item.id}`}
                tabIndex={active === index ? 0 : -1}
                className="lab-tab"
                onClick={() => setActive(index)}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
              >
                <span className="lab-tab__index">{item.index}</span>
                <span>
                  <span className="lab-tab__title">{item.title}</span>
                  <span className="lab-tab__status">{item.status}</span>
                </span>
              </button>
            ))}
          </div>

          <motion.div
            key={experiment.id}
            className="lab-panel"
            id={`lab-panel-${experiment.id}`}
            role="tabpanel"
            aria-labelledby={`lab-tab-${experiment.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lab-panel__head">
              <div>
                <p className="eyebrow mb-3">Experiment {experiment.index}</p>
                <h3 className="lab-panel__title">{experiment.title}</h3>
                <p className="lab-panel__subtitle">{experiment.subtitle}</p>
              </div>
              <span className="lab-panel__status" data-tone={experiment.statusTone}>
                {experiment.status}
              </span>
            </div>

            <Diagram experiment={experiment} />

            <div className="lab-panel__panel">
              <p className="text-[13px] leading-[1.75] text-soft">{experiment.summary}</p>

              <div className="lab-detail">
                <div>
                  <p className="lab-detail__label">Deployment path</p>
                  <ol className="lab-steps">
                    {experiment.deployment.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="lab-detail__label">Lessons learned</p>
                  <ul className="lab-lessons">
                    {experiment.lessons.map((lesson) => (
                      <li key={lesson}>{lesson}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lab-services" aria-label="Services used">
                {experiment.services.map((service) => (
                  <span className="chip" key={service}>
                    {service}
                  </span>
                ))}
              </div>

              <p className="lab-note">
                {experiment.status} — a working study, not a production claim.
                Infrastructure notes and code are available on request.{' '}
                <a className="link-slide text-champagne" href={mailto}>
                  Request the notes
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
