"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import ChatLauncher from "./ChatLauncher";

const OnekoCat = dynamic(() => import("@/components/common/OnekoCat"), {
  ssr: false,
});

/**
 * The cat follows the mouse pointer, so it is only fetched once a pointing
 * device is actually used — it is pure decoration and irrelevant on touch.
 * The chat launcher renders immediately but defers its heavy chunk until the
 * widget is opened.
 */
export default function LazyComponents() {
  const [showCat, setShowCat] = useState(false);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setShowCat(true);
    };

    window.addEventListener("pointermove", onPointerMove, {
      once: true,
      passive: true,
    });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <>
      {showCat ? <OnekoCat /> : null}
      <ChatLauncher />
    </>
  );
}
