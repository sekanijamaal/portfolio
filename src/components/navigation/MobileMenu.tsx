import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../../data/site';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Close, Github, Linkedin, Mail, Printer } from '../ui/icons';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenResume: () => void;
}

export function MobileMenu({ open, onClose, onOpenResume }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(ref, open, onClose);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={ref}
          className="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="menu-overlay__head">
            <a className="nav__brand" href="#top" onClick={onClose}>
              <span className="nav__monogram" aria-hidden="true">
                {site.monogram}
              </span>
              <span className="nav__name">{site.name}</span>
            </a>
            <button
              type="button"
              className="icon-btn border-0"
              onClick={onClose}
              aria-label="Close menu"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>

          <ul className="menu-overlay__links">
            {site.nav.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + index * 0.04, duration: 0.4 }}
              >
                <a className="menu-overlay__link" href={item.href} onClick={onClose}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26, duration: 0.4 }}
            >
              <a className="menu-overlay__link" href="#contact" onClick={onClose}>
                <span>{String(site.nav.length + 1).padStart(2, '0')}</span>
                Contact
              </a>
            </motion.li>
          </ul>

          <div className="menu-overlay__foot">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                onClose();
                onOpenResume();
              }}
            >
              <Printer className="h-3.5 w-3.5" />
              Resume
            </button>

            <div className="flex items-center gap-3">
              <a className="icon-btn" href={`mailto:${site.email}`} aria-label="Email Sidney">
                <Mail className="h-4 w-4" />
              </a>
              <a
                className="icon-btn"
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                className="icon-btn"
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
