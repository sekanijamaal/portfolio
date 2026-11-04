import { useEffect, useState } from 'react';

let cached: boolean | null = null;

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(() => cached ?? true);

  useEffect(() => {
    if (cached !== null) {
      setSupported(cached);
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      cached = Boolean(gl);
    } catch {
      cached = false;
    }
    setSupported(Boolean(cached));
  }, []);

  return supported;
}
