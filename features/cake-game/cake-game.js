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
  const decoToggles = [...document.querySelectorAll(".deco-toggle")];

  const cakePreview = document.getElementById("cakePreview");
  const sprinkles = document.querySelector(".sprinkles");
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
    !sprinkles ||
    !drizzle ||
    !cherry ||
    !flame ||
    !wishText
  ) {
    return;
  }

  let gameStep = 1;
  let selectedFlavor = "vanilla";

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
    cakePreview.classList.remove("flavor-vanilla", "flavor-chocolate", "flavor-strawberry");
    cakePreview.classList.add(`flavor-${selectedFlavor}`);
  }

  function renderDecorations() {
    const enabled = {
      sprinkles: decoToggles.find((item) => item.dataset.deco === "sprinkles")?.checked,
      cherry: decoToggles.find((item) => item.dataset.deco === "cherry")?.checked,
      drizzle: decoToggles.find((item) => item.dataset.deco === "drizzle")?.checked,
    };

    sprinkles.classList.toggle("hidden", !enabled.sprinkles);
    cherry.classList.toggle("hidden", !enabled.cherry);
    drizzle.classList.toggle("hidden", !enabled.drizzle);
  }

  function resetGame() {
    selectedFlavor = "vanilla";
    flavorOptions.forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.flavor === "vanilla");
    });

    decoToggles.forEach((item) => {
      item.checked = item.dataset.deco === "sprinkles";
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

  decoToggles.forEach((item) => {
    item.addEventListener("change", renderDecorations);
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
