import React, { useRef, useEffect } from "react";
import IsDevice from "../../lib/utils/isDevice";

export default function CustomCursor() {
  // const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const scopeRef = useRef(null);

  useEffect(() => {
    // if (cursorRef.current == null || cursorRef == null) return;
    if (dotRef.current == null || dotRef == null) return;
    document.addEventListener("mousemove", (e) => {
      if (dotRef.current == null) return;
      // cursorRef.current.setAttribute(
      //   "style",
      //   "top: " + e.pageY + "px; left: " + e.pageX + "px;"
      // );
      dotRef.current.setAttribute(
        "style",
        "top: " + e.clientY + "px; left: " + e.clientX + "px;"
      );
      scopeRef.current.setAttribute(
        "style",
        "top: " + e.clientY + "px; left: " + e.clientX + "px;"
      );
    });

    document.addEventListener("mousedown", () => {
      if (dotRef.current == null) return;
      scopeRef.current.classList.add("expand");
      setTimeout(() => {
        if (dotRef.current == null) return;
        scopeRef.current.classList.remove("expand");
      }, 500);
    });
    // document.addEventListener("mousedown", () => {
    //   if (cursorRef.current == null) return;
    //   cursorRef.current.classList.add("expand");
    //   setTimeout(() => {
    //     if (cursorRef.current == null) return;
    //     cursorRef.current.classList.remove("expand");
    //   }, 500);
    // });
  }, []);

  if (typeof navigator !== "undefined" && IsDevice.any()) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <>
      {/* <div className="cursor" ref={cursorRef}></div> */}
      <div className="dot" ref={dotRef}></div>
      <div className="scope" ref={scopeRef}></div>
    </>
  );
}
