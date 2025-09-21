// Main JavaScript for Visio-Experts landing page

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", function () {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";

      // Toggle aria-expanded
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);

      // Toggle mobile nav visibility
      if (isExpanded) {
        mobileNav.hidden = true;
        mobileNav.classList.remove("show");
      } else {
        mobileNav.hidden = false;
        mobileNav.classList.add("show");
      }

      // Update button text/icon
      const span = mobileMenuBtn.querySelector("span");
      if (span) {
        span.textContent = isExpanded ? "☰" : "✕";
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenuBtn.contains(event.target) &&
        !mobileNav.contains(event.target)
      ) {
        if (!mobileNav.hidden) {
          mobileMenuBtn.setAttribute("aria-expanded", "false");
          mobileNav.hidden = true;
          mobileNav.classList.remove("show");

          const span = mobileMenuBtn.querySelector("span");
          if (span) {
            span.textContent = "☰";
          }
        }
      }
    });

    // Close mobile menu when window is resized to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && !mobileNav.hidden) {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
        mobileNav.classList.remove("show");

        const span = mobileMenuBtn.querySelector("span");
        if (span) {
          span.textContent = "☰";
        }
      }
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Close mobile menu if open
        if (mobileNav && !mobileNav.hidden) {
          mobileMenuBtn.setAttribute("aria-expanded", "false");
          mobileNav.hidden = true;
          mobileNav.classList.remove("show");

          const span = mobileMenuBtn.querySelector("span");
          if (span) {
            span.textContent = "☰";
          }
        }
      }
    });
  });

  // FAQ accordion functionality
  const faqDetails = document.querySelectorAll("#faq details");
  faqDetails.forEach((details) => {
    details.addEventListener("toggle", function () {
      // Close other open details
      if (this.open) {
        faqDetails.forEach((other) => {
          if (other !== this) {
            other.open = false;
          }
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollY = currentScrollY;
  });

  // Add notification badge functionality (if needed)
  function addNotificationBadge() {
    const ctaButton = document.querySelector(".btn.cta");
    if (ctaButton && !ctaButton.querySelector(".notification-badge")) {
      const badge = document.createElement("span");
      badge.className = "notification-badge";
      badge.textContent = "1";
      badge.setAttribute("aria-label", "1 nouvelle notification");
      ctaButton.style.position = "relative";
      ctaButton.appendChild(badge);
    }
  }

  // Initialize notification badge
  addNotificationBadge();

  // Initialize localization (default: en)
  initLocalization();

  // Hero section animations and interactions
  initializeHeroSection();

  // Form validation and submission (if forms exist)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll(
        "input[required], textarea[required]"
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (isValid) {
        // Here you would typically send the form data
        console.log("Form submitted successfully");
        // You could show a success message or redirect
      }
    });
  });

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Performance optimization: Preload critical resources
  const criticalImages = ["assets/Logo-visio-expert-noir 2.png"];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
});

/* Localization helpers */
function applyLanguage(lang) {
  if (!lang) return;
  const nodes = document.querySelectorAll(".i18n");
  nodes.forEach((el) => {
    const en = el.getAttribute("data-en");
    const fr = el.getAttribute("data-fr");
    if (!en && !fr) return;
    if (lang === "fr" && fr) {
      if (
        el.tagName.toLowerCase() === "input" ||
        el.tagName.toLowerCase() === "textarea"
      ) {
        el.placeholder = fr;
      } else {
        el.textContent = fr;
      }
    } else {
      if (
        el.tagName.toLowerCase() === "input" ||
        el.tagName.toLowerCase() === "textarea"
      ) {
        el.placeholder = en || fr;
      } else {
        el.textContent = en || fr;
      }
    }
  });

  // update aria-labels for elements that opted in
  const ariaNodes = document.querySelectorAll('[data-aria="true"].i18n');
  ariaNodes.forEach((el) => {
    const en = el.getAttribute("data-en");
    const fr = el.getAttribute("data-fr");
    const label = lang === "fr" && fr ? fr : en || fr;
    if (label) el.setAttribute("aria-label", label);
  });

  // update lang buttons aria-pressed
  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((b) => {
    b.setAttribute(
      "aria-pressed",
      b.getAttribute("data-lang") === lang ? "true" : "false"
    );
  });

  // store choice
  try {
    localStorage.setItem("visio_lang", lang);
  } catch (e) {
    // ignore storage errors
  }

  // Accessibility: set the document language for assistive tech and browsers
  try {
    document.documentElement.lang = lang === "fr" ? "fr" : "en";
  } catch (e) {
    // ignore if document not available
  }
}

function initLocalization() {
  const stored = (function () {
    try {
      return localStorage.getItem("visio_lang");
    } catch (e) {
      return null;
    }
  })();
  const browser = (navigator.language || navigator.userLanguage || "en")
    .slice(0, 2)
    .toLowerCase();
  const defaultLang = stored || (browser === "fr" ? "fr" : "en");
  applyLanguage(defaultLang);

  // wire up language buttons
  const langContainer = document.querySelector(".lang-switch");
  if (langContainer) {
    langContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn");
      if (!btn) return;
      const lang = btn.getAttribute("data-lang");
      if (lang) applyLanguage(lang);
    });
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Hero section functionality
function initializeHeroSection() {
  const heroSection = document.querySelector(".hero");
  const heroCards = document.querySelectorAll(".hero-card");
  const heroImages = document.querySelectorAll(".hero-left, .hero-right");
  const chartBars = document.querySelectorAll(".chart-bar");

  if (!heroSection) return;

  // Animate hero cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate cards with staggered delay
        heroCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "all 0.6s ease-out";

            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          }, index * 200);
        });

        // Animate chart bars
        setTimeout(() => {
          chartBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.transform = "scaleY(1)";
              bar.style.transition = "transform 0.5s ease-out";
            }, index * 100);
          });
        }, 500);

        heroObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  heroObserver.observe(heroSection);

  // Initialize chart bars with scaleY(0)
  chartBars.forEach((bar) => {
    bar.style.transform = "scaleY(0)";
    bar.style.transformOrigin = "bottom";
  });

  // Parallax effect for hero images
  const parallaxHandler = throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    heroImages.forEach((img, index) => {
      const offset = rate + index * 10;
      img.style.transform = `translateY(${offset}px)`;
    });
  }, 16);

  window.addEventListener("scroll", parallaxHandler);

  // Hero card hover effects
  heroCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
      this.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    });
  });

  // Animate rating stars
  const stars = document.querySelectorAll(".star");
  if (stars.length > 0) {
    setTimeout(() => {
      stars.forEach((star, index) => {
        setTimeout(() => {
          star.style.opacity = "0";
          star.style.transform = "scale(0)";
          star.style.transition = "all 0.3s ease-out";

          setTimeout(() => {
            star.style.opacity = "1";
            star.style.transform = "scale(1)";
          }, 50);
        }, index * 100);
      });
    }, 1000);
  }

  // Partner logos animation
  const partnerLogos = document.querySelectorAll(".partner-logo");
  if (partnerLogos.length > 0) {
    const partnerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            partnerLogos.forEach((logo, index) => {
              setTimeout(() => {
                logo.style.opacity = "0";
                logo.style.transform = "translateY(20px)";
                logo.style.transition = "all 0.5s ease-out";

                setTimeout(() => {
                  logo.style.opacity = "0.6";
                  logo.style.transform = "translateY(0)";
                }, 100);
              }, index * 100);
            });
            partnerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const partnersSection = document.querySelector(".partners");
    if (partnersSection) {
      partnerObserver.observe(partnersSection);
    }
  }

  // CTA button pulse animation
  const ctaButton = document.querySelector(".hero-cta .btn.primary");
  if (ctaButton) {
    setInterval(() => {
      ctaButton.style.transform = "scale(1.05)";
      setTimeout(() => {
        ctaButton.style.transform = "scale(1)";
      }, 200);
    }, 3000);
  }
}

// Payment section functionality
function initializePaymentSection() {
  const tabs = document.querySelectorAll(".feature-tabs .tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });

  // Animate payment mockup on scroll
  const paymentSection = document.querySelector(".payment-section");
  const mockup = document.querySelector(".payment-mockup");

  if (paymentSection && mockup) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mockup.style.opacity = "0";
            mockup.style.transform = "translateY(30px)";
            mockup.style.transition = "all 0.8s ease-out";

            setTimeout(() => {
              mockup.style.opacity = "1";
              mockup.style.transform = "translateY(0)";
            }, 200);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(paymentSection);
  }

  // Animate feature items on scroll
  const featureItems = document.querySelectorAll(".feature-item");
  if (featureItems.length > 0) {
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(featureItems).indexOf(entry.target);

            setTimeout(() => {
              entry.target.style.opacity = "0";
              entry.target.style.transform = "translateX(-20px)";
              entry.target.style.transition = "all 0.5s ease-out";

              setTimeout(() => {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateX(0)";
              }, 100);
            }, index * 100);

            itemObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    featureItems.forEach((item) => itemObserver.observe(item));
  }
}

// Adoption section carousel functionality
function initializeAdoptionSection() {
  const cardsContainer = document.querySelector(".cards-container");
  const carouselWrapper = document.querySelector(".carousel-wrapper");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  if (!cardsContainer || !carouselWrapper || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cardWidth = 301.75 + 20; // card width + gap
  const totalCards = document.querySelectorAll(".profession-card").length;

  function getVisibleCards() {
    const wrapperWidth = carouselWrapper.offsetWidth;
    return Math.floor(wrapperWidth / cardWidth);
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);

    // Clamp currentIndex to valid range
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    const translateX = -currentIndex * cardWidth;
    cardsContainer.style.transform = `translateX(${translateX}px)`;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    // Visual feedback
    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    prevBtn.style.cursor = currentIndex === 0 ? "not-allowed" : "pointer";

    nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    nextBtn.style.cursor = currentIndex >= maxIndex ? "not-allowed" : "pointer";

    console.log(
      `Current index: ${currentIndex}, Max index: ${maxIndex}, Visible cards: ${visibleCards}`
    );
  }

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Initialize
  updateCarousel();

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCarousel();
  });

  // Animate cards on scroll
  const cards = document.querySelectorAll(".profession-card");
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(30px)";
            entry.target.style.transition = "all 0.6s ease-out";

            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, 100);
          }, index * 100);

          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => cardObserver.observe(card));
}
/* Testimonials responsive slider - calculates slide sizes to avoid overflow */
// Reusable slider initializer: takes a wrapper selector, track selector, and an options object
function createResponsiveSlider({
  wrapperSelector,
  trackSelector,
  prevBtnSelector,
  nextBtnSelector,
  dotsSelector,
}) {
  const wrapper = document.querySelector(wrapperSelector);
  const track = document.querySelector(trackSelector);
  if (!wrapper || !track) return null;

  const slides = Array.from(track.children);
  const prevBtn = prevBtnSelector
    ? document.querySelector(prevBtnSelector)
    : null;
  const nextBtn = nextBtnSelector
    ? document.querySelector(nextBtnSelector)
    : null;
  const dotsWrap = dotsSelector ? document.querySelector(dotsSelector) : null;

  function readGapPx() {
    const style = window.getComputedStyle(track);
    const g =
      style.getPropertyValue("gap") ||
      style.getPropertyValue("column-gap") ||
      getComputedStyle(track).gap;
    return g ? parseFloat(g) : 24;
  }

  let currentIndex = 0;
  let itemsPerView = 3;
  let slideWidth = 0;
  let gap = readGapPx();

  function calcItemsPerView() {
    const w = window.innerWidth;
    if (w >= 1100) return 3;
    if (w >= 700) return 2;
    return 1;
  }

  function setSlideWidths() {
    gap = readGapPx();
    itemsPerView = calcItemsPerView();

    const wrapperStyle = window.getComputedStyle(wrapper);
    const wrapperPaddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;
    const wrapperPaddingRight = parseFloat(wrapperStyle.paddingRight) || 0;
    const availableWidth =
      wrapper.clientWidth - wrapperPaddingLeft - wrapperPaddingRight;

    const totalGaps = Math.max(0, (itemsPerView - 1) * gap);
    slideWidth = (availableWidth - totalGaps) / itemsPerView;
    if (slideWidth < 0) slideWidth = 0;

    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${Math.floor(slideWidth)}px`;
      slide.style.minWidth = `${Math.floor(slideWidth)}px`;
    });

    const maxIndex = Math.max(0, slides.length - itemsPerView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
  }

  function updateUI() {
    const translateX = -currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(${translateX}px)`;

    const maxIndex = Math.max(0, slides.length - itemsPerView);
    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIndex; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = i === currentIndex ? "active" : "";
        b.addEventListener("click", () => {
          currentIndex = i;
          updateUI();
        });
        dotsWrap.appendChild(b);
      }
    }
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateUI();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateUI();
    });

  let resizeTimer = null;
  function recalc() {
    setSlideWidths();
    updateUI();
  }
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalc, 80);
  });

  window.addEventListener("load", () => {
    setTimeout(() => recalc(), 50);
  });

  // initial run
  recalc();

  return {
    goTo(index) {
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      currentIndex = Math.min(Math.max(0, index), maxIndex);
      updateUI();
    },
    next() {
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateUI();
    },
    prev() {
      currentIndex = Math.max(0, currentIndex - 1);
      updateUI();
    },
  };
}

// initialize existing testimonial slider (if present) using original selectors
const testimonialsSlider = createResponsiveSlider({
  wrapperSelector: ".testimonials-wrapper",
  trackSelector: ".testimonials-container",
  prevBtnSelector: ".testimonial-btn.prev",
  nextBtnSelector: ".testimonial-btn.next",
  dotsSelector: ".carousel-dots",
});

// initialize adoption slider and wire it to the testimonial buttons (so testimonial controls control adoption slider)
const adoptionSlider = createResponsiveSlider({
  wrapperSelector: ".carousel-wrapper",
  trackSelector: ".cards-container",
  prevBtnSelector: ".carousel-btn.prev",
  nextBtnSelector: ".carousel-btn.next",
  dotsSelector: null,
});

// Ensure the adoption carousel shows the middle card ("Wellness practitioner") by default
// Cards order in HTML: 0=Independent, 1=Coach, 2=Wellness practitioner, 3=Therapist, 4=Liberal
(function ensureAdoptionCentered() {
  const targetCardIndex = 2; // zero-based index for "Wellness practitioner"

  function centerAdoption() {
    if (!adoptionSlider) return;

    const wrapper = document.querySelector(".carousel-wrapper");
    const track = document.querySelector(".cards-container");
    const slides = track ? Array.from(track.children) : [];
    if (!wrapper || slides.length === 0) return;

    // Read computed sizes: slide width and gap (set by the slider on init)
    const slideStyle = window.getComputedStyle(slides[0]);
    const slideWidth = parseFloat(slideStyle.width) || 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    const wrapperWidth = wrapper.clientWidth;

    // Compute how many items fit in view
    const itemsPerView = Math.max(
      1,
      Math.floor((wrapperWidth + gap) / (slideWidth + gap))
    );

    const leftIndex = Math.max(
      0,
      targetCardIndex - Math.floor(itemsPerView / 2)
    );
    adoptionSlider.goTo(leftIndex);
  }

  // Run shortly after init to allow slider to set widths
  window.addEventListener("load", () => setTimeout(centerAdoption, 80));
  // Recenter on resize (throttle)
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(centerAdoption, 120);
  });
  // Also try once immediately (in case sizes are already set)
  setTimeout(centerAdoption, 120);
})();

// Note: testimonial buttons are intentionally NOT wired to control the adoption slider.
// Each slider is initialized independently above and their own prev/next buttons control only their track.

// Note: primary initialization happens in the top-level DOMContentLoaded handler earlier.
// Here we avoid re-calling functions that may not be defined in all scopes.

// FAQ / Accordion initializer
function initializeFAQAccordion() {
  const container = document.getElementById("faq");
  if (!container) return;

  const items = Array.from(container.querySelectorAll(".faq-item"));
  const toggles = items.map((it) => it.querySelector(".faq-toggle"));

  function closeAll(except = null) {
    items.forEach((item) => {
      const panel = item.querySelector(".faq-panel");
      const btn = item.querySelector(".faq-toggle");
      if (btn && btn !== except) {
        btn.setAttribute("aria-expanded", "false");
      }
      if (panel) {
        panel.hidden = true;
        panel.style.maxHeight = null;
        panel.style.opacity = 0;
      }
    });
  }

  function openItem(item) {
    const panel = item.querySelector(".faq-panel");
    const btn = item.querySelector(".faq-toggle");
    if (!panel || !btn) return;

    // close others
    closeAll(btn);

    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    // set maxHeight for transition
    const prev = panel.style.maxHeight;
    panel.style.maxHeight = panel.scrollHeight + "px";
    panel.style.opacity = 1;
    // cleanup after transition
    setTimeout(() => {
      panel.style.maxHeight = null; // remove inline to allow natural height
    }, 300);
  }

  toggles.forEach((toggle, idx) => {
    const item = items[idx];
    const panel = item.querySelector(".faq-panel");

    // ensure initial state
    toggle.setAttribute("aria-expanded", "false");
    if (panel) {
      panel.hidden = true;
      panel.style.opacity = 0;
      panel.style.transition = "max-height 280ms ease, opacity 180ms ease";
      panel.style.overflow = "hidden";
    }

    // click / activate
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        // close
        toggle.setAttribute("aria-expanded", "false");
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + "px"; // set starting height
          requestAnimationFrame(() => {
            panel.style.maxHeight = "0px";
            panel.style.opacity = 0;
          });
          setTimeout(() => {
            panel.hidden = true;
            panel.style.maxHeight = null;
          }, 300);
        }
      } else {
        openItem(item);
      }
    });

    // keyboard accessibility
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle.click();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = toggles[(idx + 1) % toggles.length];
        next.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = toggles[(idx - 1 + toggles.length) % toggles.length];
        prev.focus();
      }
    });
  });
}

// Initialize FAQ accordion on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  initializeFAQAccordion();
});
