(() => {
  const initOpening = () => {
    const opening = document.getElementById("moodlumaOpening");
    if (!opening) return;

    // Visual-only opening. Never reads/writes Moodluma app state.
    let finished = false;

    const removeOpening = () => {
      if (finished) return;
      finished = true;
      opening.classList.add("is-finished");
      opening.style.display = "none";
      opening.style.pointerEvents = "none";
    };

    const closeOpening = () => {
      if (finished || opening.classList.contains("is-leaving")) return;
      opening.classList.add("is-leaving");
      window.setTimeout(removeOpening, 320);
    };

    // Fast opening: begin exit at 3.6s, fully gone at about 4.3s.
    window.setTimeout(closeOpening, 3600);

    // Fail-safe: the overlay can never block the site indefinitely.
    window.setTimeout(removeOpening, 4300);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOpening, { once: true });
  } else {
    initOpening();
  }
})();
