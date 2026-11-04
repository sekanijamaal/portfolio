import { site } from '../../data/site';
import { EXPERIENCE_CHAPTERS, INTERESTS } from '../../data/certifications';
import { CURRENTLY_EXPLORING } from '../../data/skills';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, Github, Linkedin } from '../ui/icons';

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="shell">
        <SectionHeading
          index="01"
          label="About"
          id="about-heading"
          title={
            <>
              Engineering ideas into{' '}
              <span className="text-champagne">digital solutions.</span>
            </>
          }
          lead="A software developer with a scientific background, a practical streak, and a growing specialism in cloud architecture."
        />

        <div className="about-grid">
          <div data-reveal>
            <p className="about-lede">
              I am a software developer with a background in Animal Biology and
              Conservation Sciences and a growing specialization in software
              engineering and cloud architecture.
            </p>

            <div className="about-copy body-copy">
              <p>
                My journey into technology has been driven by curiosity, continuous
                learning, and a desire to build practical solutions. That path has
                been self-directed and deliberate: learning the fundamentals, then
                testing them on real products.
              </p>
              <p>
                I work across backend development, frontend engineering, cloud
                infrastructure, and application deployment. I care about the whole
                path a feature takes — the data model, the interface, the deploy,
                and the person who has to operate it afterwards.
              </p>
              <p>
                I am particularly interested in scalable systems, infrastructure
                automation, SaaS products, and cloud-native technologies. The
                architecture lab on this site is where those interests become
                concrete experiments.
              </p>
            </div>
          </div>

          <aside className="about-aside" data-reveal data-delay="0.1">
            <div className="about-aside__block">
              <p className="about-aside__label">Technical interests</p>
              <ul className="interest-list">
                {INTERESTS.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>

            <div className="about-aside__block">
              <p className="about-aside__label">Currently exploring</p>
              <div className="flex flex-wrap gap-2">
                {CURRENTLY_EXPLORING.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-aside__block">
              <p className="about-aside__label">Elsewhere</p>
              <div className="about-socials">
                <a
                  className="btn btn-outline !min-h-10 !px-4 !py-2 !text-[9px]"
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  className="btn btn-outline !min-h-10 !px-4 !py-2 !text-[9px]"
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="timeline" aria-label="Career journey">
          {EXPERIENCE_CHAPTERS.map((chapter) => (
            <article
              className="timeline__chapter"
              key={chapter.index}
              data-reveal
            >
              <span className="timeline__index">{chapter.index}</span>
              <p className="timeline__label">{chapter.label}</p>
              <h3 className="timeline__title">{chapter.title}</h3>
              <p className="timeline__body">{chapter.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-muted">
          A journey, not a job history — no employment dates have been invented here.
        </p>
      </div>
    </section>
  );
}
