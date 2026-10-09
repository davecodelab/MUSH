'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Returns false during SSR and initial hydration to prevent React hydration mismatch,
 * then evaluates the user's actual prefers-reduced-motion media query once mounted.
 */
export function useSafeReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(shouldReduce) : false;
}
