'use client';

import { useEffect, useState } from 'react';

/** 미디어 쿼리 일치 여부. 서버 렌더링과 첫 렌더에서는 false */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** Tailwind의 md(768px) 이상 */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
