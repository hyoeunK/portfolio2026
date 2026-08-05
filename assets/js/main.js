const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("[data-lightbox-copy]");
const lightboxPlaceholder = document.querySelector("[data-lightbox-placeholder]");
const lightboxImage = document.querySelector("[data-lightbox-image-view]");
const lightboxCloseButtons = document.querySelectorAll(".lightbox-close, .lightbox-backdrop");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");

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

setActiveTab("projects");
