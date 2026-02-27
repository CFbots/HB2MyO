(() => {
  function createCakeSnapshotController({
    cakePreview,
    takePictureBtn,
    pictureModal,
    picturePreviewImg,
    closePicturePreviewBtn,
    pictureStickerSrc = "src/nh_sticker.png",
    downloadOnCapture = true,
  }) {
    if (!cakePreview || !takePictureBtn || !pictureModal || !picturePreviewImg || !closePicturePreviewBtn) {
      return null;
    }

    let latestSnapshotUrl = "";
    let latestSnapshotName = "";

    function buildSnapshotName() {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      return `you-made-a-cake-${stamp}.png`;
    }

    function downloadSnapshot(dataUrl, fileName) {
      if (!dataUrl) {
        return;
      }
      const link = document.createElement("a");
      link.download = fileName || "you-made-a-cake.png";
      link.href = dataUrl;
      link.click();
    }

    function waitForImageLoad(image) {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const onLoad = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Sticker image failed to load"));
        };
        const cleanup = () => {
          image.removeEventListener("load", onLoad);
          image.removeEventListener("error", onError);
        };

        image.addEventListener("load", onLoad);
        image.addEventListener("error", onError);
      });
    }

    function addCaptureStickerElement() {
      const sticker = document.createElement("img");
      sticker.className = "snapshot-capture-sticker";
      sticker.src = new URL(pictureStickerSrc, document.baseURI).href;
      sticker.alt = "";
      sticker.setAttribute("aria-hidden", "true");
      cakePreview.appendChild(sticker);
      return sticker;
    }

    function closePicturePreview() {
      pictureModal.classList.remove("open");
      pictureModal.classList.add("hidden");
      pictureModal.setAttribute("aria-hidden", "true");
    }

    function openPicturePreview(dataUrl) {
      picturePreviewImg.src = dataUrl;
      pictureModal.classList.remove("hidden");
      pictureModal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        pictureModal.classList.add("open");
      });
    }

    async function takeSnapshot() {
      if (typeof window.html2canvas !== "function") {
        takePictureBtn.textContent = "Snapshot unavailable";
        setTimeout(() => {
          takePictureBtn.textContent = "Take a Picture";
        }, 1200);
        return;
      }

      const previousLabel = takePictureBtn.textContent;
      takePictureBtn.disabled = true;
      takePictureBtn.textContent = "Taking...";
      let captureStickerElement = null;

      try {
        captureStickerElement = addCaptureStickerElement();
        await waitForImageLoad(captureStickerElement);

        const canvas = await window.html2canvas(cakePreview, {
          backgroundColor: null,
          scale: 2,
        });

        latestSnapshotUrl = canvas.toDataURL("image/png");
        latestSnapshotName = buildSnapshotName();
        openPicturePreview(latestSnapshotUrl);

        if (downloadOnCapture) {
          downloadSnapshot(latestSnapshotUrl, latestSnapshotName);
        }
      } catch (error) {
        takePictureBtn.textContent = "Try again";
      } finally {
        captureStickerElement?.remove();
        setTimeout(() => {
          takePictureBtn.disabled = false;
          takePictureBtn.textContent = previousLabel;
        }, 600);
      }
    }

    closePicturePreviewBtn.addEventListener("click", closePicturePreview);
    pictureModal.addEventListener("click", (event) => {
      if (event.target === pictureModal) {
        closePicturePreview();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !pictureModal.classList.contains("hidden")) {
        closePicturePreview();
      }
    });

    return {
      takeSnapshot,
      closePicturePreview,
      openPicturePreview,
      downloadSnapshot,
      getLatestSnapshotUrl: () => latestSnapshotUrl,
      getLatestSnapshotName: () => latestSnapshotName,
    };
  }

  window.createCakeSnapshotController = createCakeSnapshotController;
})();
