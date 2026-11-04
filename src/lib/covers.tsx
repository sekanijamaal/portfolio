import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { BOOKS } from '../data/books';
import { loadCoverArt, type CoverAsset } from '../lib/coverArt';

interface CoverContextValue {
  covers: CoverAsset[];
  byId: Map<number, CoverAsset>;
  ready: boolean;
  failed: boolean;
  progress: number;
}

const CoverContext = createContext<CoverContextValue | null>(null);

export function CoverProvider({ children }: { children: ReactNode }) {
  const [covers, setCovers] = useState<CoverAsset[]>([]);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;

    loadCoverArt(BOOKS, (done, total) => {
      if (!live) return;
      setProgress(Math.round((done / total) * 100));
    })
      .then((assets) => {
        if (!live) return;
        setCovers(assets);
        setProgress(100);
      })
      .catch(() => {
        if (!live) return;
        setFailed(true);
      });

    return () => {
      live = false;
    };
  }, []);

  const value = useMemo<CoverContextValue>(() => {
    return {
      covers,
      byId: new Map(covers.map((cover) => [cover.id, cover])),
      ready: covers.length === BOOKS.length,
      failed,
      progress,
    };
  }, [covers, failed, progress]);

  return <CoverContext.Provider value={value}>{children}</CoverContext.Provider>;
}

export function useCovers(): CoverContextValue {
  const context = useContext(CoverContext);
  if (!context) throw new Error('useCovers must be used inside CoverProvider');
  return context;
}
