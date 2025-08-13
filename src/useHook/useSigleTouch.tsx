import { useRef } from "react";
export const useSingleTouch = (onPress: () => void, delay = 1000) => {
  const lastPressRef = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastPressRef.current < delay) return;
    lastPressRef.current = now;
    onPress();
  };
};
