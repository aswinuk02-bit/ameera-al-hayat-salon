/* =========================================================================
   AMEERA Al Hayat Beauty Salon — site behavior
   Language toggle + RTL switch, services tabs/accordion/search,
   dynamic rendering of stats/gallery/testimonials/hours, nav + WhatsApp FAB.
   ========================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     CONFIG — edit these placeholders when real business details arrive
     --------------------------------------------------------------------- */
  const CONFIG = {
    whatsappNumber: "971500000000", // digits only, country code, no + or spaces
    whatsappDefaultMessage: {
      en: "Hi AMEERA Al Hayat! I'd like to book an appointment.",
      ar: "مرحبًا صالون الأميرة الحياة! أرغب في حجز موعد."
    },
    instagramUrl: "https://instagram.com/",
    // Local photos only — no external placeholder services. Add/remove
    // entries here as real photos are swapped in under assets/images/.
    galleryImages: [
      { file: "hair-saloon-1.jpg", alt: { en: "Hair styling at AMEERA Al Hayat", ar: "تصفيف الشعر في صالون الأميرة الحياة" } },
      { file: "hair-saloon-2.jpg", alt: { en: "Braided hairstyle detail", ar: "تفاصيل تسريحة الضفائر" } },
      { file: "nail-salon-1.jpg", alt: { en: "Manicure finish", ar: "لمسة نهائية للمانيكير" } },
      { file: "nail-salon-2.jpg", alt: { en: "Nail polish colour selection", ar: "اختيار ألوان طلاء الأظافر" } },
      { file: "nail-salon-3.jpg", alt: { en: "Nail polish application", ar: "تطبيق طلاء الأظافر" } },
      { file: "massage-1.jpg", alt: { en: "Hot stone massage treatment", ar: "علاج مساج بالأحجار الساخنة" } },
      { file: "massage-2.jpg", alt: { en: "Relaxing massage session", ar: "جلسة مساج استرخاء" } }
    ]
  };

  const STORAGE_KEY = "ameera-lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "en";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------------------------------------------------------------
     i18n helpers
     --------------------------------------------------------------------- */
  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function applyStaticTranslations() {
    const dict = UI[currentLang];
    document.title = currentLang === "ar"
      ? "صالون الأميرة الحياة للتجميل | بشرة، شعر، مكياج وأظافر في الإمارات"
      : "AMEERA Al Hayat Beauty Salon | Skin, Hair, MakeUp & Nails in UAE";

    $$("[data-i18n]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n"));
      if (value !== null) el.innerHTML = value;
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n-placeholder"));
      if (value !== null) el.setAttribute("placeholder", value);
    });

    $("#langToggleLabel").textContent = dict.langToggle;
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", UI[lang].dir);

    applyStaticTranslations();
    renderAboutStats();
    renderServices();
    renderGallery();
    renderTestimonials();
    renderHours();
    updateBookingLinks();
    renderSocialIcons();

    // Re-rendering the sections above replaces their cards/tiles with fresh
    // DOM nodes that start hidden (see staggerReveal's comment). Any section
    // currently on-screen won't get a fresh IntersectionObserver trigger
    // (its visibility isn't changing), so it needs an immediate reveal here
    // — otherwise switching language while looking at e.g. the gallery
    // leaves the new images invisible.
    revealStaggerGroupsIfVisible();
  }

  /* ---------------------------------------------------------------------
     WhatsApp / booking links
     --------------------------------------------------------------------- */
  function buildWhatsAppLink() {
    const msg = encodeURIComponent(CONFIG.whatsappDefaultMessage[currentLang]);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
  }

  function updateBookingLinks() {
    const link = buildWhatsAppLink();
    ["bookNowBtn", "heroBookBtn", "whatsappFab"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("href", link);
    });

    const displayPhone = "+" + CONFIG.whatsappNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    const phoneDisplay = $("#contactPhoneDisplay");
    if (phoneDisplay) phoneDisplay.textContent = displayPhone;
    const footerPhone = $("#footerPhone");
    if (footerPhone) footerPhone.textContent = displayPhone;
  }

  function renderSocialIcons() {
    $$('.social-whatsapp').forEach((a) => a.setAttribute("href", buildWhatsAppLink()));
    $$('.social-instagram').forEach((a) => a.setAttribute("href", CONFIG.instagramUrl));

    const footerTarget = $("#footerSocialIcons");
    if (footerTarget && !footerTarget.dataset.built) {
      footerTarget.dataset.built = "1";
      footerTarget.innerHTML = `
        <a href="${buildWhatsAppLink()}" target="_blank" rel="noopener" aria-label="WhatsApp" class="social-icon social-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 5.001L2 22l5.126-1.345a9.958 9.958 0 004.878 1.242h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.069a9.93 9.93 0 00-7.073-2.928zm0 18.166h-.003a8.15 8.15 0 01-4.153-1.137l-.298-.177-3.043.799.812-2.967-.194-.304a8.156 8.156 0 01-1.253-4.36c0-4.511 3.671-8.181 8.185-8.181a8.13 8.13 0 015.789 2.398 8.129 8.129 0 012.396 5.792c-.001 4.512-3.672 8.182-8.184 8.182z"/></svg>
        </a>
        <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram" class="social-icon social-instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
        </a>`;
    }
  }

  /* ---------------------------------------------------------------------
     About stats
     --------------------------------------------------------------------- */
  function renderAboutStats() {
    const container = $("#aboutStats");
    if (!container) return;
    const stats = UI[currentLang].about.stats;
    container.innerHTML = stats.map((s) => `
      <div class="stat-box reveal-item">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join("");
  }

  /* ---------------------------------------------------------------------
     Services: tabs + accordion + search
     --------------------------------------------------------------------- */
  let activeCategoryId = SERVICES_DATA[0].id;

  function formatPrice(price) {
    const currency = UI[currentLang].services.priceCurrency;
    if (typeof price === "string") {
      return currentLang === "ar" ? `${price} ${currency}` : `${currency} ${price}`;
    }
    return currentLang === "ar" ? `${price} ${currency}` : `${currency} ${price}`;
  }

  function isAddOn(name) {
    return /^add\s*on|^إضافة/i.test(name.trim());
  }

  function renderServices() {
    const tabsEl = $("#servicesTabs");
    const panelsEl = $("#servicesPanels");
    if (!tabsEl || !panelsEl) return;

    tabsEl.innerHTML = SERVICES_DATA.map((cat) => `
      <button type="button" class="services-tab${cat.id === activeCategoryId ? " active" : ""}" data-cat="${cat.id}" role="tab" aria-selected="${cat.id === activeCategoryId}">
        ${cat.name[currentLang]}
      </button>
    `).join("");

    panelsEl.innerHTML = SERVICES_DATA.map((cat, catIndex) => `
      <div class="services-panel${cat.id === activeCategoryId ? " active" : ""}" data-cat-panel="${cat.id}" role="tabpanel">
        ${cat.subcategories.map((sub, subIndex) => {
          const openFirst = subIndex === 0;
          return `
          <div class="subcategory-card reveal-item${openFirst ? " open" : ""}" data-sub-index="${subIndex}">
            <button type="button" class="subcategory-header">
              <span>${sub.name[currentLang]}</span>
              <span class="count">${sub.items.length} ${UI[currentLang].services.itemsCount}</span>
              <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="subcategory-body">
              <div class="service-list">
                ${sub.items.map((item) => `
                  <div class="service-row" data-search="${(item.en + " " + item.ar).toLowerCase()}">
                    <span class="service-name">${isAddOn(item.en) ? `<span class="addon-tag">${UI[currentLang].services.addOn}</span>` : ""}${item[currentLang]}</span>
                    <span class="service-dots"></span>
                    <span class="service-price">${formatPrice(item.price)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>
    `).join("");

    bindServiceEvents();
    filterServices($("#serviceSearch") ? $("#serviceSearch").value : "");
  }

  function bindServiceEvents() {
    $$(".services-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategoryId = btn.getAttribute("data-cat");
        const targetPanel = $(`.services-panel[data-cat-panel="${activeCategoryId}"]`);
        const cards = $$(".subcategory-card", targetPanel);
        // Drop "in-view" while the panel is still display:none, so the cards
        // settle back to their hidden state instantly (no box == no running
        // transition) rather than reversing an in-progress one — reversing
        // a transition that's barely started is a near-zero-duration no-op.
        cards.forEach((el) => el.classList.remove("in-view"));

        $$(".services-tab").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on);
        });
        $$(".services-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-cat-panel") === activeCategoryId));
        staggerReveal(cards, { step: 90 });
      });
    });

    $$(".subcategory-header").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".subcategory-card").classList.toggle("open");
      });
    });
  }

  function filterServices(query) {
    const q = (query || "").trim().toLowerCase();
    const noResultsEl = $("#servicesNoResults");
    let anyVisibleGlobal = false;

    SERVICES_DATA.forEach((cat) => {
      const panel = $(`.services-panel[data-cat-panel="${cat.id}"]`);
      if (!panel) return;
      let categoryHasMatch = false;

      $$(".subcategory-card", panel).forEach((card) => {
        let subHasMatch = false;
        $$(".service-row", card).forEach((row) => {
          const match = !q || row.getAttribute("data-search").includes(q);
          row.classList.toggle("hidden-by-search", !match);
          if (match) subHasMatch = true;
        });
        card.style.display = subHasMatch ? "" : "none";
        if (subHasMatch) {
          categoryHasMatch = true;
          if (q) card.classList.add("open");
        }
      });

      const tabBtn = $(`.services-tab[data-cat="${cat.id}"]`);
      if (tabBtn) tabBtn.style.display = q && !categoryHasMatch ? "none" : "";
      if (categoryHasMatch) anyVisibleGlobal = true;
    });

    // If searching and the active tab now has no matches, jump to the first tab that does
    if (q) {
      const activePanel = $(`.services-panel[data-cat-panel="${activeCategoryId}"]`);
      const activeHasMatch = activePanel && $$(".subcategory-card", activePanel).some((c) => c.style.display !== "none");
      if (!activeHasMatch) {
        const firstMatch = SERVICES_DATA.find((cat) => {
          const panel = $(`.services-panel[data-cat-panel="${cat.id}"]`);
          return panel && $$(".subcategory-card", panel).some((c) => c.style.display !== "none");
        });
        if (firstMatch) {
          activeCategoryId = firstMatch.id;
          $$(".services-tab").forEach((b) => {
            const on = b.getAttribute("data-cat") === activeCategoryId;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on);
          });
          $$(".services-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-cat-panel") === activeCategoryId));
        }
      }
    }

    if (noResultsEl) noResultsEl.hidden = anyVisibleGlobal || !q;
  }

  /* ---------------------------------------------------------------------
     Gallery — real salon photos from assets/images/ only, no external
     placeholder service. Re-render on language switch so alt text follows
     the active language.
     --------------------------------------------------------------------- */
  function renderGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    grid.innerHTML = CONFIG.galleryImages.map((img) => {
      const src = `assets/images/optimized/${img.file}`;
      const alt = img.alt[currentLang];
      return `
        <a href="${src}" target="_blank" rel="noopener" aria-label="${alt}" class="reveal-item">
          <img src="${src}" alt="${alt}" loading="lazy">
        </a>`;
    }).join("");
  }

  /* ---------------------------------------------------------------------
     Testimonials
     --------------------------------------------------------------------- */
  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    if (!grid) return;
    grid.innerHTML = TESTIMONIALS.map((rev) => `
      <div class="testimonial-card reveal-item">
        <div class="testimonial-stars">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
        <p class="testimonial-text">"${rev.text[currentLang]}"</p>
        <p class="testimonial-name">${rev.name[currentLang]}</p>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------------------
     Opening hours
     --------------------------------------------------------------------- */
  function renderHours() {
    const table = $("#hoursTable");
    if (!table) return;
    const hours = UI[currentLang].contact.hours;
    table.innerHTML = hours.map((h) => `<tr><td>${h.day}</td><td>${h.time}</td></tr>`).join("");
  }

  /* ---------------------------------------------------------------------
     Header scroll state + mobile menu
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = $("#siteHeader");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hamburger = $("#hamburgerBtn");
    const nav = $("#mainNav");
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });

    $$("#mainNav a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — fade-in/scale-in each .reveal element the first time
     it enters the viewport. Elements whose innerHTML is re-rendered on
     language switch (search box, tabs, panels, grids) keep their node
     identity, so this only needs to run once on load.
     --------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = $$(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Staggered card cascade — pops a group of elements in one after another
     (inspired by the cascading icon/card grids on kuruvaislandresort.com,
     which use WOW.js + animate.css with incremental per-item delays).
     Re-triggerable: calling it again (e.g. on a services tab switch)
     restarts the cascade for that group's current elements.

     Elements must already carry the "reveal-item" class from the moment
     they're inserted into the DOM (baked into the render templates), NOT
     added here right before "in-view". Adding the hidden state and the
     visible state back-to-back would just retarget a transition that has
     barely started — CSS's spec'd "reversal shortening" then completes it
     in only a few milliseconds instead of the full duration, so it would
     look like no animation played at all. Resting at the hidden state for
     a real stretch of time first (since render, or since the panel was
     last hidden) is what makes the reveal actually visible.
     --------------------------------------------------------------------- */
  function staggerReveal(elements, { step = 80 } = {}) {
    const list = Array.from(elements || []);
    if (!list.length) return;

    list.forEach((el, i) => {
      el.classList.remove("in-view");
      el.style.transitionDelay = i * step + "ms";
    });

    // Force a reflow so the removal above is committed before "in-view" is
    // re-added on the next frame.
    void list[0].offsetHeight;

    requestAnimationFrame(() => {
      list.forEach((el) => el.classList.add("in-view"));
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-triggered stagger groups — the about stats, gallery tiles and
     testimonial cards cascade in when their grid scrolls into view. The
     Services panel cascade targets whichever tab is currently active, so
     it stays correct even after the user switches tabs.

     These grids get their innerHTML replaced on every language switch
     (see renderGallery/renderTestimonials/renderAboutStats/renderServices),
     which drops in fresh "reveal-item" nodes starting hidden. The
     observers below are intentionally never unobserved, so a section that
     gets re-rendered while off-screen still reveals correctly the next
     time it's scrolled into view. A section that's re-rendered while
     already on-screen won't get a fresh intersection event though (its
     visibility isn't changing) — that case is handled separately by
     revealStaggerGroupsIfVisible(), called right after setLanguage()
     re-renders everything.
     --------------------------------------------------------------------- */
  function getStaggerGroups() {
    return [
      { el: $("#aboutStats"), step: 100 },
      { el: $("#galleryGrid"), step: 70 },
      { el: $("#testimonialsGrid"), step: 120 }
    ].filter((g) => g.el);
  }

  function isInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function revealStaggerGroupsIfVisible() {
    getStaggerGroups().forEach((g) => {
      if (isInViewport(g.el)) staggerReveal(g.el.children, { step: g.step });
    });

    const activePanel = $(".services-panel.active");
    if (activePanel && isInViewport(activePanel)) {
      staggerReveal($$(".subcategory-card", activePanel), { step: 90 });
    }
  }

  function initStaggerGroups() {
    const groups = getStaggerGroups();
    if (!groups.length) return;

    if (!("IntersectionObserver" in window)) {
      groups.forEach((g) => staggerReveal(g.el.children, { step: g.step }));
      return;
    }

    groups.forEach((g) => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) staggerReveal(entry.target.children, { step: g.step });
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      io.observe(g.el);
    });

    // The Services section's active tab panel also gets a scroll-triggered
    // cascade, matching the others.
    const panelsEl = $("#servicesPanels");
    if (panelsEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            staggerReveal($$(".subcategory-card", $(".services-panel.active")), { step: 90 });
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      io.observe(panelsEl);
    }
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    $("#footerYear").textContent = new Date().getFullYear();

    $("#langToggle").addEventListener("click", () => {
      setLanguage(currentLang === "en" ? "ar" : "en");
    });

    $("#serviceSearch").addEventListener("input", (e) => filterServices(e.target.value));

    initHeader();
    setLanguage(currentLang);
    initScrollReveal();
    initStaggerGroups();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
