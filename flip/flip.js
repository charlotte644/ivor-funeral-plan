/* Shared flip-book viewer: each page sets window.BOOK = {pages:[...], label} before loading this file. */
(function () {
  const book = window.BOOK;
  const el = document.getElementById("book");
  const status = document.getElementById("status");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const total = book.pages.length;

  book.pages.forEach((src, i) => {
    const page = document.createElement("div");
    page.className = "page";
    if (i === 0 || i === total - 1) page.dataset.density = "hard";
    const img = document.createElement("img");
    img.src = src; img.alt = book.label + ", page " + (i + 1); img.draggable = false;
    page.appendChild(img);
    el.appendChild(page);
  });

  const flip = new St.PageFlip(el, {
    width: 559, height: 794, size: "stretch",
    minWidth: 240, maxWidth: 559, minHeight: 340, maxHeight: 794,
    showCover: true, usePortrait: true, mobileScrollSupport: false,
    maxShadowOpacity: 0.45, flippingTime: 900
  });
  flip.loadFromHTML(el.querySelectorAll(".page"));

  function update() {
    const i = flip.getCurrentPageIndex();
    const portrait = flip.getOrientation() === "portrait";
    let text;
    if (i === 0) text = "Front";
    else if (i === total - 1) text = total === 2 ? "Message" : "Back";
    else if (portrait || i + 1 >= total - 1) text = "Page " + (i + 1);
    else text = "Pages " + (i + 1) + " and " + (i + 2);
    status.textContent = text + " · " + book.label;
    prev.disabled = i === 0;
    next.disabled = i >= total - 1;
  }
  flip.on("flip", update);
  flip.on("changeOrientation", update);
  flip.on("init", update);
  update();
  prev.addEventListener("click", () => flip.flipPrev());
  next.addEventListener("click", () => flip.flipNext());
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") flip.flipNext();
    if (e.key === "ArrowLeft") flip.flipPrev();
  });
})();
