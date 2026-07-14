import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prevBase = prevPathRef.current.split("/")[1];
    const currentBase = pathname.split("/")[1];

    if (prevBase !== currentBase) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}
