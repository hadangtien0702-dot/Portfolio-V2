/**
 * cursor.js
 * Handles: custom circle cursor, back-to-top button, sticky header
 */

(function () {
  const cursorDot = document.getElementById("cursor-dot");
  const backBtn = document.getElementById("back-to-top");
  let scrollTimer = null;

  // ── Cursor: follow mouse ──
  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });

  document.addEventListener("mousedown", () =>
    cursorDot.classList.add("clicking"),
  );
  document.addEventListener("mouseup", () =>
    cursorDot.classList.remove("clicking"),
  );

  // ── Back to Top: click ──
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Single scroll listener ──
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const header = document.querySelector("header");
      const section2 = document.getElementById("case-study");

      // Sticky header
      if (header) header.classList.toggle("scrolled", scrollY > 30);

      // Cursor glow: show while scrolling, hide 800ms after stop
      cursorDot.classList.add("visible");
      document.body.classList.add("is-scrolling");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        cursorDot.classList.remove("visible");
        document.body.classList.remove("is-scrolling");
      }, 800);

      // Back to top: appear when section 2 is in reach
      if (backBtn && section2) {
        backBtn.classList.toggle(
          "visible",
          scrollY >= section2.offsetTop - 200,
        );
      }
    },
    { passive: true },
  );
})();
