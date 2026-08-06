const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("[data-lightbox-copy]");
const lightboxPlaceholder = document.querySelector("[data-lightbox-placeholder]");
const lightboxImage = document.querySelector("[data-lightbox-image-view]");
const lightboxCloseButtons = document.querySelectorAll(".lightbox-close, .lightbox-backdrop");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");
const flowCarousels = document.querySelectorAll("[data-flow-carousel]");

function setActiveTab(targetId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tabTarget === targetId);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === targetId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tabTarget);
  });
});

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImage) {
    lightboxImage.hidden = true;
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  }
  if (lightboxPlaceholder) {
    lightboxPlaceholder.hidden = false;
    lightboxPlaceholder.textContent = "";
  }
  document.body.style.overflow = "";
}

function openLightbox(trigger) {
  if (!lightbox || !lightboxTitle || !lightboxCaption || !lightboxPlaceholder) {
    return;
  }

  const imageSrc = trigger.dataset.lightboxImage;

  lightboxTitle.textContent = trigger.dataset.lightboxTitle || "Expanded View";
  lightboxCaption.textContent = trigger.dataset.lightboxCaption || "";

  if (imageSrc && lightboxImage) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = trigger.dataset.lightboxTitle || "";
    lightboxImage.hidden = false;
    if (lightboxPlaceholder) {
      lightboxPlaceholder.hidden = true;
      lightboxPlaceholder.textContent = "";
    }
  } else if (lightboxPlaceholder) {
    lightboxPlaceholder.hidden = false;
    lightboxPlaceholder.textContent = trigger.textContent.trim();
    if (lightboxImage) {
      lightboxImage.hidden = true;
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
    }
  }

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-lightbox-trigger]");

  if (trigger) {
    openLightbox(trigger);
  }
});

lightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

flowCarousels.forEach((carousel) => {
  const scroller = carousel.querySelector("[data-flow-scroller]");
  const previousButton = carousel.querySelector("[data-flow-prev]");
  const nextButton = carousel.querySelector("[data-flow-next]");
  const dots = Array.from(carousel.querySelectorAll("[data-flow-dot]"));

  if (!scroller || !previousButton || !nextButton || !dots.length) {
    return;
  }

  function getMaxScroll() {
    return Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  }

  function getActivePage() {
    const maxScroll = getMaxScroll();

    if (!maxScroll) {
      return 0;
    }

    return Math.min(
      dots.length - 1,
      Math.max(0, Math.round((scroller.scrollLeft / maxScroll) * (dots.length - 1))),
    );
  }

  function updateControls() {
    const activePage = getActivePage();

    previousButton.disabled = activePage === 0;
    nextButton.disabled = activePage === dots.length - 1;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activePage);
    });
  }

  function scrollToPage(page) {
    const targetPage = Math.min(dots.length - 1, Math.max(0, page));
    const scrollProgress = dots.length > 1 ? targetPage / (dots.length - 1) : 0;

    scroller.scrollTo({
      left: scrollProgress * getMaxScroll(),
      behavior: "smooth",
    });
  }

  previousButton.addEventListener("click", () => {
    scrollToPage(getActivePage() - 1);
  });

  nextButton.addEventListener("click", () => {
    scrollToPage(getActivePage() + 1);
  });

  scroller.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateControls);
    },
    { passive: true },
  );

  window.addEventListener("resize", updateControls);
  updateControls();
});

setActiveTab("projects");
