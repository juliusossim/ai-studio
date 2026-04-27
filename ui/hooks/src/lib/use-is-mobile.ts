import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setIsMobile(false);
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
