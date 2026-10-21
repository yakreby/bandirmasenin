"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`totop${show ? " totop--show" : ""}`}
      aria-label="Sayfanın başına dön"
      title="Yukarı çık"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <ArrowUp size={20} />
    </button>
  );
}
