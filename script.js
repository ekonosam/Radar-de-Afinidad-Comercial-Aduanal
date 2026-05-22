// Pega aquí tu enlace público de Power BI.
// Usa el valor que viene dentro de src="..." en el iframe generado por Power BI.
// Ejemplo:
// const POWER_BI_EMBED_URL = "https://app.powerbi.com/view?r=eyJrIjoi...";
const POWER_BI_EMBED_URL = "";

// Alternativa: si prefieres pegar el iframe completo, pégalo aquí.
// Ejemplo:
// const POWER_BI_IFRAME_CODE = '<iframe title="..." src="https://app.powerbi.com/view?r=..." frameborder="0" allowFullScreen="true"></iframe>';
const POWER_BI_IFRAME_CODE = "";

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const backToTop = document.querySelector("#backToTop");
const revealElements = document.querySelectorAll(".reveal");
const sectionLinks = document.querySelectorAll(".nav-links a");
const sections = [...sectionLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function extractPowerBiUrl(iframeCode) {
  if (!iframeCode.trim()) return "";

  const match = iframeCode.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function renderPowerBiFrame() {
  const wrapper = document.querySelector("#powerbiFrameWrapper");
  const placeholder = document.querySelector("#powerbiPlaceholder");

  if (!wrapper) return;

  const embedUrl = POWER_BI_EMBED_URL.trim() || extractPowerBiUrl(POWER_BI_IFRAME_CODE);

  if (!embedUrl) {
    return;
  }

  if (!embedUrl.startsWith("https://app.powerbi.com/")) {
    if (placeholder) {
      placeholder.innerHTML = `
        <p class="placeholder-label">URL no válida</p>
        <h3>El enlace debe empezar con <code>https://app.powerbi.com/</code></h3>
        <p>Revisa el valor de <code>POWER_BI_EMBED_URL</code> en <code>script.js</code>.</p>
      `;
    }
    return;
  }

  wrapper.innerHTML = `
    <iframe
      title="Radar Comercial Aduanal - Power BI"
      src="${embedUrl}"
      allowfullscreen="true">
    </iframe>
  `;
}

function setupMobileMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

function setupRevealAnimation() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

function setActiveLink() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    }
  });
}

function toggleBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 600) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

function setupBackToTop() {
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setupAccordion() {
  const buttons = document.querySelectorAll(".accordion-button");
  const panels = document.querySelectorAll(".accordion-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.dataset.panel;
      const panel = document.querySelector(`#${panelId}`);
      const isActive = button.classList.contains("active");

      buttons.forEach((item) => item.classList.remove("active"));
      panels.forEach((item) => item.classList.remove("active"));

      if (!isActive && panel) {
        button.classList.add("active");
        panel.classList.add("active");
      }
    });
  });
}

window.addEventListener("scroll", () => {
  setActiveLink();
  toggleBackToTop();
});

renderPowerBiFrame();
setupMobileMenu();
setupRevealAnimation();
setupBackToTop();
setupAccordion();
setActiveLink();
toggleBackToTop();
