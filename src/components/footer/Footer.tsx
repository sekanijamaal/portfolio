import { site } from '../../data/site';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ArrowUp } from '../ui/icons';

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              <span className="nav__monogram" aria-hidden="true">
                {site.monogram}
              </span>
              <span className="footer__name">{site.name}</span>
            </div>
            <p className="footer__role mt-3">
              Software Developer &amp; AWS Solutions Architect
            </p>
          </div>

          <ul className="footer__links">
            {site.footerLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__bottom">
          <span>
            Sidney Odum © {site.portfolioYear} · Software Developer &amp; AWS
            Solutions Architect
          </span>
          <div className="flex flex-wrap items-center gap-6">
            <a href={`mailto:${site.email}`} className="link-slide">
              Email
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="link-slide"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-slide"
            >
              LinkedIn
            </a>
            <button
              type="button"
              className="footer__back"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: reducedMotion ? 'auto' : 'smooth',
                })
              }
            >
              Back to top
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
