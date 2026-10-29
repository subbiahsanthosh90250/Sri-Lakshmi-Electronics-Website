// Preloader
(() => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  const hide = () => preloader.classList.add("hidden");
  window.addEventListener("load", () => setTimeout(hide, 450));
  setTimeout(hide, 2500); // fallback
})();

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
      });
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll(
    ".category-card, .why-card, .wp-cat-card, .mc-badge, .brand-pill, .section-header, .about-content, .about-image, .location-card, .map-wrap, .hero-visual-card, .whirlpool-strip-left"
  );
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Animated hero entrance
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero-anim").forEach((el) => el.classList.add("in-view"));
  });

  // Count-up numbers (e.g. mc-badge strong, data-count elements)
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countIo.observe(el));
  }

  // Hero card tilt (pointer devices only)
  const hero = document.querySelector(".hero");
  const visualCard = document.querySelector(".hero-visual-card");
  if (hero && visualCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const cardRect = visualCard.getBoundingClientRect();
      const cx = e.clientX - cardRect.left - cardRect.width / 2;
      const cy = e.clientY - cardRect.top - cardRect.height / 2;
      const rotateY = Math.max(-10, Math.min(10, (cx / cardRect.width) * 18));
      const rotateX = Math.max(-10, Math.min(10, (-cy / cardRect.height) * 18));
      visualCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      visualCard.style.transform = "rotateX(0) rotateY(0)";
    });
  }
});
