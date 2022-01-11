import { useEffect, useRef } from "react";

export default function useWindowClick(cb, refs = []) {
  const onClick = useRef(cb);

  useEffect(() => {
    const listener = e => {
      if (refs?.some(ref => ref?.current?.contains(e.target))) {
        return;
      }
      onClick.current();
    };
    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [refs, cb]);
}
