import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop is a component that scrolls the window to the top
 * whenever the route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Also close any mobile menu if it exists
    document.body.classList.remove("menu-open", "mobile-menu-open");
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}

export default ScrollToTop;
