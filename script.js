const celebrateBtn = document.getElementById("celebrateBtn");

function launchConfetti(count = 42) {
  const colors = ["#e76f51", "#f4a261", "#2a9d8f", "#264653", "#e9c46a"];

  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.left = `${Math.random() * 100}vw`;
    bit.style.top = `${-10 - Math.random() * 20}px`;
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDelay = `${Math.random() * 0.3}s`;
    bit.style.transform = `translateY(0) rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(bit);

    setTimeout(() => bit.remove(), 1500);
  }
}

celebrateBtn.addEventListener("click", () => {
  launchConfetti();
  celebrateBtn.textContent = "Celebrating you";
  setTimeout(() => {
    celebrateBtn.textContent = "Tap to celebrate";
  }, 1500);
});
