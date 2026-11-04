import { useState } from 'react';
import { CoverProvider } from './lib/covers';
import { useScrollReveals } from './hooks/useScrollReveals';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { Nav } from './components/navigation/Nav';
import { MobileMenu } from './components/navigation/MobileMenu';
import { Hero } from './components/hero/Hero';
import { LibraryIndex } from './components/hero/LibraryIndex';
import { BookPanel } from './components/hero/BookPanel';
import { ResumeModal } from './components/ResumeModal';
import { About } from './components/about/About';
import { Projects } from './components/projects/Projects';
import { Expertise } from './components/expertise/Expertise';
import { Lab } from './components/architecture/Lab';
import { Experience } from './components/certifications/Experience';
import { Contact } from './components/contact/Contact';
import { Footer } from './components/footer/Footer';

function Portfolio() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollReveals(reducedMotion);

  const openResume = () => {
    setMenuOpen(false);
    setResumeOpen(true);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav onOpenResume={openResume} onOpenMenu={() => setMenuOpen(true)} />

      <main id="main">
        <Hero
          onSelectBook={setSelectedBookId}
          onOpenLibrary={() => setLibraryOpen(true)}
          selectedBookId={selectedBookId}
        />
        <About />
        <Projects onSelectBook={setSelectedBookId} />
        <Expertise onSelectBook={setSelectedBookId} />
        <Lab />
        <Experience />
        <Contact />
      </main>

      <Footer />

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenResume={openResume}
      />
      <LibraryIndex
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={setSelectedBookId}
      />
      <BookPanel
        bookId={selectedBookId}
        onClose={() => setSelectedBookId(null)}
        onNavigate={setSelectedBookId}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <CoverProvider>
      <Portfolio />
    </CoverProvider>
  );
}
