import { useEffect, useState } from 'react';
import { site } from '../../data/site';
import { useActiveSection } from '../../hooks/useActiveSection';
import { ArrowUpRight, Menu } from '../ui/icons';

interface NavProps {
  onOpenResume: () => void;
  onOpenMenu: () => void;
}

const sectionIds = ['top', 'about', 'projects', 'expertise', 'lab', 'experience', 'contact'];

export function Nav({ onOpenResume, onOpenMenu }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="shell nav__inner">
        <a className="nav__brand" href="#top" aria-label={`${site.name} — back to top`}>
          <span className="nav__monogram" aria-hidden="true">
            {site.monogram}
          </span>
          <span className="nav__name">{site.name}</span>
        </a>

        <nav aria-label="Primary">
          <ul className="nav__links">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  className="nav__link"
                  href={item.href}
                  data-active={active === item.href.slice(1)}
                  aria-current={active === item.href.slice(1) ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <button type="button" className="nav__resume" onClick={onOpenResume}>
            Resume
          </button>
          <a className="nav__contact" href="#contact">
            Contact
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            className="nav__menu-button icon-btn !h-9 !w-9"
            onClick={onOpenMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
