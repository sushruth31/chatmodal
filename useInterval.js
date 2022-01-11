import { useEffect, useRef } from "react";

export default function useInterval(cb, interval, immediate = false, dependencies = []) {
  const callBack = useRef(cb);

  useEffect(() => {
    const handler = callBack.current;
    if (immediate) handler();
    setInterval(() => {
      handler();
    }, [interval]);
    return () => clearInterval(handler);
  }, dependencies);
}
