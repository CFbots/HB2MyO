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

  const flavorOptions = [...document.querySelectorAll(".flavor-option")];
  const decorateGrid = step2Panel?.querySelector(".decorate-grid");

  const cakePreview = document.getElementById("cakePreview");
  const drizzle = document.querySelector(".drizzle");
  const cherry = document.querySelector(".cherry");
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
    !cakePreview ||
    !drizzle ||
    !cherry ||
    !flame ||
    !wishText ||
    !decorateGrid
  ) {
    return;
  }

  const candle = cakePreview.querySelector(".candle");
  let cookies = cakePreview.querySelector(".cookies");
  if (!cookies) {
    cookies = document.createElement("div");
    cookies.className = "cookies hidden";
    cookies.setAttribute("aria-hidden", "true");
    if (candle) {
      cakePreview.insertBefore(cookies, candle);
    } else {
      cakePreview.appendChild(cookies);
    }
  }

  const decorations = [
    { id: "cherry", emoji: "\u{1F352}", target: cherry },
    { id: "choco", emoji: "\u{1F36B}", target: drizzle },
    { id: "cookies", emoji: "\u{1F36A}", target: cookies },
    // Extendable: add more items with { id, emoji, target }.
  ];

  let gameStep = 1;
  let selectedFlavor = "vanilla";
  const selectedDecorations = new Set(["cherry"]);

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
      if (selectedDecorations.has(deco.id)) {
        selectedDecorations.delete(deco.id);
      } else {
        selectedDecorations.add(deco.id);
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
    cakePreview.classList.remove("flavor-vanilla", "flavor-chocolate", "flavor-strawberry", "flavor-earlgrey");
    cakePreview.classList.add(`flavor-${selectedFlavor}`);
  }

  function renderDecorations() {
    decorations.forEach((deco) => {
      deco.target.classList.toggle("hidden", !selectedDecorations.has(deco.id));
      const btn = decoButtons.get(deco.id);
      if (btn) {
        const isActive = selectedDecorations.has(deco.id);
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      }
    });
  }

  function resetGame() {
    selectedFlavor = "vanilla";
    flavorOptions.forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.flavor === "vanilla");
    });

    selectedDecorations.clear();
    selectedDecorations.add("cherry");

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

  renderFlavor();
  renderDecorations();
})();
