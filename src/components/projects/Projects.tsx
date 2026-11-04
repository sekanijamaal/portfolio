import { PROJECTS } from '../../data/projects';
import { useCovers } from '../../lib/covers';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight } from '../ui/icons';

interface ProjectsProps {
  onSelectBook: (id: number) => void;
}

export function Projects({ onSelectBook }: ProjectsProps) {
  const { byId } = useCovers();

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="shell">
        <SectionHeading
          index="02"
          label="Selected work"
          id="projects-heading"
          title={
            <>
              Products, platforms, and{' '}
              <span className="text-champagne">the systems behind them.</span>
            </>
          }
          lead="A small selection of real work. Screenshots are taken from the live sites; where a screenshot is not available, the volume’s original cover artwork stands in — no fabricated product shots."
        />

        <div>
          {PROJECTS.map((project, index) => {
            const flip = index % 2 === 1;
            const cover = project.coverId !== undefined ? byId.get(project.coverId) : undefined;
            const isScreenshot = Boolean(project.image);

            return (
              <article
                className={`project ${flip ? 'project--flip' : ''}`}
                key={project.id}
                data-reveal
              >
                <div className="project__visual">
                  <div
                    className={`project__media ${
                      isScreenshot ? '' : 'project__media--drawing'
                    }`}
                  >
                    {isScreenshot ? (
                      <img
                        src={project.image}
                        alt={project.imageAlt ?? `${project.name} project screenshot`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : cover ? (
                      <img
                        src={cover.dataUrl}
                        alt={`Original cover artwork for ${project.name}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-[0.18em] text-muted">
                        {project.artworkLabel ?? project.name}
                      </div>
                    )}

                    <span className="project__status">{project.status}</span>

                    {!isScreenshot ? (
                      <span className="project__drawing-caption">
                        Original cover artwork · no project screenshot available
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="project__info">
                  <p className="project__index">
                    Project {project.index}
                  </p>
                  <h3 className="project__name">{project.name}</h3>
                  <p className="project__category">{project.category}</p>
                  <p className="project__summary">{project.description}</p>

                  <div className="project__stack" aria-label="Technologies used">
                    {project.stack.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="project__actions">
                    {project.href ? (
                      <a
                        className="project__link"
                        href={project.href}
                        target={project.href.startsWith('#') ? undefined : '_blank'}
                        rel={project.href.startsWith('#') ? undefined : 'noreferrer'}
                      >
                        {project.hrefLabel ?? 'View project'}
                        {project.href.startsWith('#') ? (
                          <span aria-hidden="true">↓</span>
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
                      </a>
                    ) : null}

                    {project.coverId !== undefined ? (
                      <button
                        type="button"
                        className="project__link project__link--muted"
                        onClick={() => onSelectBook(project.coverId!)}
                      >
                        Open related volume
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] leading-relaxed text-muted">
          <span className="text-champagne">Note</span>
          NAAB and the Infrastructure as Code experiments are ongoing. They are
          presented here as work in progress, not as completed production systems.
        </p>
      </div>
    </section>
  );
}
