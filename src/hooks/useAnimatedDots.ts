import { useEffect, useState } from "react";

export function useAnimatedDots(active: boolean, intervalMs = 400, maxDots = 3) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!active) {
      setDots('');
      return;
    }
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % (maxDots + 1);
      setDots('.'.repeat(count));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [active, intervalMs, maxDots]);

  return dots;
} 