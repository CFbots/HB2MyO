(() => {
  const mainPage = document.getElementById("mainPage");
  const cakeGame = document.getElementById("cakeGame");
  const cakeBtn = document.getElementById("cakeBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");

  if (!mainPage || !cakeGame || !cakeBtn || !backHomeBtn) {
    return;
  }

  const stepLabel = document.getElementById("stepLabel");
  const step1Panel = document.getElementById("step1Panel");
  const step2Panel = document.getElementById("step2Panel");
  const step3Panel = document.getElementById("step3Panel");
  const toStep2Btn = document.getElementById("toStep2Btn");
  const backToStep1Btn = document.getElementById("backToStep1Btn");
  const toStep3Btn = document.getElementById("toStep3Btn");
  const backToStep2Btn = document.getElementById("backToStep2Btn");
  const lightCandleBtn = document.getElementById("lightCandleBtn");
  const takePictureBtn = document.getElementById("takePictureBtn");
  const pictureModal = document.getElementById("pictureModal");
  const picturePreviewImg = document.getElementById("picturePreviewImg");
  const closePicturePreviewBtn = document.getElementById("closePicturePreviewBtn");

  const flavorOptions = [...document.querySelectorAll(".flavor-option")];
  const decorateGrid = step2Panel?.querySelector(".decorate-grid");

  const cakePreview = document.getElementById("cakePreview");
  const flame = document.getElementById("flame");
  const wishText = document.getElementById("wishText");

  if (
    !stepLabel ||
    !step1Panel ||
    !step2Panel ||
    !step3Panel ||
    !toStep2Btn ||
    !backToStep1Btn ||
    !toStep3Btn ||
    !backToStep2Btn ||
    !lightCandleBtn ||
    !takePictureBtn ||
    !pictureModal ||
    !picturePreviewImg ||
    !closePicturePreviewBtn ||
    !cakePreview ||
    !flame ||
    !wishText ||
    !decorateGrid
  ) {
    return;
  }

  const decorations = [
    { id: "cherry", emoji: "\u{1F352}" },
    { id: "redbean", emoji: "\u{1FAD8}" },
    { id: "cookies", emoji: "\u{1F36A}" },
    { id: "strawberry", emoji: "\u{1F353}" },
    { id: "blueberry", emoji: "\u{1FAD0}" },
    { id: "mint", emoji: "\u{1F33F}" },
    { id: "dango", emoji: "\u{1F361}" },
    // Extendable: add more items with { id, emoji }.
  ];

  let gameStep = 1;
  let selectedFlavor = "ube";
  const stickerElementsByDeco = new Map(decorations.map((deco) => [deco.id, []]));
  let dragLayer = 10;
  const snapshotController =
    typeof window.createCakeSnapshotController === "function"
      ? window.createCakeSnapshotController({
          cakePreview,
          takePictureBtn,
          pictureModal,
          picturePreviewImg,
          closePicturePreviewBtn,
          pictureStickerSrc: "src/nh_sticker.png",
          downloadOnCapture: true,
        })
      : null;

  const decoScrollMenu = document.createElement("div");
  decoScrollMenu.className = "deco-scroll-menu";
  decoScrollMenu.setAttribute("role", "group");
  decoScrollMenu.setAttribute("aria-label", "Decoration options");

  const decoButtons = new Map();
  decorations.forEach((deco) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "deco-emoji-btn";
    btn.dataset.deco = deco.id;
    btn.textContent = deco.emoji;
    btn.setAttribute("aria-label", deco.id);
    btn.title = deco.id;
    btn.addEventListener("click", () => {
      const stickers = stickerElementsByDeco.get(deco.id);
      if (stickers) {
        const sticker = createSticker(deco, stickers.length);
        stickers.push(sticker);
      }
      renderDecorations();
    });
    decoButtons.set(deco.id, btn);
    decoScrollMenu.appendChild(btn);
  });
  decorateGrid.replaceChildren(decoScrollMenu);

  function triggerConfetti(count = 42) {
    if (typeof window.launchConfetti === "function") {
      window.launchConfetti(count);
    }
  }

  function setGameStep(step) {
    gameStep = step;
    stepLabel.textContent = `Step ${gameStep} of 3`;

    step1Panel.classList.toggle("hidden", step !== 1);
    step2Panel.classList.toggle("hidden", step !== 2);
    step3Panel.classList.toggle("hidden", step !== 3);
  }

  function renderFlavor() {
    cakePreview.classList.remove("flavor-ube", "flavor-chocolate", "flavor-matcha", "flavor-earlgrey");
    cakePreview.classList.add(`flavor-${selectedFlavor}`);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function placeStickerWithinBounds(sticker, left, top) {
    const maxLeft = Math.max(0, cakePreview.clientWidth - sticker.offsetWidth);
    const maxTop = Math.max(0, cakePreview.clientHeight - sticker.offsetHeight);
    const x = clamp(left, 0, maxLeft);
    const y = clamp(top, 0, maxTop);
    sticker.style.left = `${x}px`;
    sticker.style.top = `${y}px`;
  }

  function makeStickerDraggable(sticker) {
    let dragState = null;

    sticker.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const currentLeft = Number.parseFloat(sticker.style.left || "0");
      const currentTop = Number.parseFloat(sticker.style.top || "0");

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: currentLeft,
        startTop: currentTop,
      };

      dragLayer += 1;
      sticker.style.zIndex = String(dragLayer);
      sticker.classList.add("dragging");
      sticker.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    sticker.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      placeStickerWithinBounds(sticker, dragState.startLeft + deltaX, dragState.startTop + deltaY);
    });

    function endDrag(event) {
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }
      sticker.classList.remove("dragging");
      dragState = null;
    }

    sticker.addEventListener("pointerup", endDrag);
    sticker.addEventListener("pointercancel", endDrag);
  }

  function createSticker(deco, index) {
    const sticker = document.createElement("button");
    sticker.type = "button";
    sticker.className = "deco-sticker";
    sticker.dataset.deco = deco.id;
    sticker.textContent = deco.emoji;
    sticker.setAttribute("aria-label", `${deco.id} sticker`);
    sticker.title = deco.id;
    cakePreview.appendChild(sticker);

    const left = 52 + index * 42;
    const top = 124 + (index % 2) * 24;
    placeStickerWithinBounds(sticker, left, top);
    makeStickerDraggable(sticker);

    sticker.addEventListener("dblclick", () => {
      sticker.remove();
      const stickers = stickerElementsByDeco.get(deco.id);
      if (stickers) {
        const next = stickers.filter((item) => item !== sticker);
        stickerElementsByDeco.set(deco.id, next);
      }
      renderDecorations();
    });

    return sticker;
  }

  function renderDecorations() {
    decorations.forEach((deco) => {
      const btn = decoButtons.get(deco.id);
      if (btn) {
        const isActive = (stickerElementsByDeco.get(deco.id)?.length ?? 0) > 0;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      }
    });
  }

  function resetGame() {
    selectedFlavor = "ube";
    flavorOptions.forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.flavor === "ube");
    });

    stickerElementsByDeco.forEach((stickers) => {
      stickers.forEach((sticker) => sticker.remove());
      stickers.length = 0;
    });

    flame.classList.add("hidden");
    wishText.classList.add("hidden");
    lightCandleBtn.textContent = "Light candle";

    renderFlavor();
    renderDecorations();
  }

  function openCakeGame() {
    resetGame();
    mainPage.classList.add("hidden");
    cakeGame.classList.remove("hidden");
    setGameStep(1);
  }

  function closeCakeGame() {
    cakeGame.classList.add("hidden");
    mainPage.classList.remove("hidden");
  }

  cakeBtn.addEventListener("click", openCakeGame);
  backHomeBtn.addEventListener("click", closeCakeGame);

  toStep2Btn.addEventListener("click", () => {
    setGameStep(2);
  });

  backToStep1Btn.addEventListener("click", () => {
    setGameStep(1);
  });

  toStep3Btn.addEventListener("click", () => {
    setGameStep(3);
  });

  backToStep2Btn.addEventListener("click", () => {
    setGameStep(2);
  });

  flavorOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedFlavor = btn.dataset.flavor;
      flavorOptions.forEach((opt) => opt.classList.toggle("active", opt === btn));
      renderFlavor();
    });
  });

  lightCandleBtn.addEventListener("click", () => {
    flame.classList.remove("hidden");
    wishText.classList.remove("hidden");
    lightCandleBtn.textContent = "Candle lit";
    triggerConfetti(64);
  });

  takePictureBtn.addEventListener("click", () => {
    if (snapshotController) {
      snapshotController.takeSnapshot();
      return;
    }
    takePictureBtn.textContent = "Snapshot unavailable";
    setTimeout(() => {
      takePictureBtn.textContent = "Take a Picture";
    }, 1200);
  });

  renderFlavor();
  renderDecorations();
})();
