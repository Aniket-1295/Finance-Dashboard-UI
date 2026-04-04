import { useState, useEffect } from 'react';

export function useLocalStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : fallback;
    } catch { return fallback; }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);

  return [val, setVal];
}
