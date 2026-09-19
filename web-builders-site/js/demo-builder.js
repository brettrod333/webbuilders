/* ============================================================
   Web Builders — live website demo builder
   Step 1: business info. Step 2: instant preview + floating
   customization panel (colors, font/style, section order &
   visibility, photo treatment). Everything renders client-side —
   no page reload between steps.
   ============================================================ */

(function () {

  var PALETTES = [
    { key: "warm-trustworthy", name: "Warm & Trustworthy", primary: "#1F3B57", secondary: "#F5EFE0", accent: "#C9A227" },
    { key: "clean-modern", name: "Clean & Modern", primary: "#2B2F36", secondary: "#FFFFFF", accent: "#2F8F82" },
    { key: "fresh-friendly", name: "Fresh & Friendly", primary: "#6B8F71", secondary: "#FBF7F0", accent: "#E27D60" },
    { key: "bold-energetic", name: "Bold & Energetic", primary: "#142850", secondary: "#FFFFFF", accent: "#D7263D" },
    { key: "classic-elegant", name: "Classic & Elegant", primary: "#14161A", secondary: "#FFFFFF", accent: "#B08D57" },
    { key: "earthy-grounded", name: "Earthy & Grounded", primary: "#4B3B32", secondary: "#F1E6D8", accent: "#8A9A5B" },
    { key: "cool-calm", name: "Cool & Calm", primary: "#223843", secondary: "#F4F7F7", accent: "#5FA8A0" },
    { key: "bright-playful", name: "Bright & Playful", primary: "#2B2440", secondary: "#FFFBEF", accent: "#F2994A" },
    { key: "rustic-cozy", name: "Rustic & Cozy", primary: "#3E2723", secondary: "#F5EDE4", accent: "#C1440E" },
    { key: "coastal-airy", name: "Coastal & Airy", primary: "#17475E", secondary: "#F7FAFB", accent: "#E0A96D" },
    { key: "luxe-moody", name: "Luxe & Moody", primary: "#1B1B1E", secondary: "#F0EAE0", accent: "#7A1F2B" }
  ];

  var STYLES = [
    { key: "clean-modern", name: "Clean & Modern", heading: "'Poppins', sans-serif", body: "'Inter', sans-serif", radius: { sm: "8px", md: "14px", lg: "20px", pill: "999px" }, weight: "700" },
    { key: "classic-elegant", name: "Classic & Elegant", heading: "'Playfair Display', serif", body: "'Lora', serif", radius: { sm: "3px", md: "6px", lg: "10px", pill: "6px" }, weight: "600" },
    { key: "friendly-warm", name: "Friendly & Warm", heading: "'Quicksand', sans-serif", body: "'Nunito Sans', sans-serif", radius: { sm: "10px", md: "18px", lg: "28px", pill: "999px" }, weight: "700" },
    { key: "bold-structured", name: "Bold & Structured", heading: "'Archivo', sans-serif", body: "'Inter', sans-serif", radius: { sm: "2px", md: "4px", lg: "6px", pill: "4px" }, weight: "800" }
  ];

  var PHOTO_STYLES = [
    { key: "illustration", name: "Abstract illustration", note: "Custom graphic shapes in your palette — no stock photo clichés." },
    { key: "placeholder", name: "Placeholder photo frames", note: "Sized-correctly photo boxes, ready for the photos you'll send." },
    { key: "stock", name: "Stock-style photography", note: "Marked as high-quality stock/AI photography to be sourced." }
  ];

  var SECTION_META = {
    hero: { label: "Home", locked: true },
    about: { label: "About Us", eyebrow: "About Us", heading: "Why customers choose us" },
    services: { label: "Services / Pricing", eyebrow: "Services & Pricing", heading: "What we offer" },
    gallery: { label: "Photo Gallery", eyebrow: "Photo Gallery", heading: "See it for yourself" },
    testimonials: { label: "Testimonials", eyebrow: "What People Say", heading: "Happy customers" },
    contact: { label: "Contact", eyebrow: "Get In Touch", heading: "Let's talk." }
  };

  var GOAL_PRIORITY = [
    "Get customers to call",
    "Get bookings",
    "Get customers to order/buy online",
    "Get customers to visit",
    "Look professional online"
  ];

  /* ------------------------------------------------------------
     Layout archetypes — researched from real conventions for each
     kind of business (restaurant homepages lead with food photos +
     menu + reviews; law firm homepages lead with credibility/case
     results before practice areas; contractor sites keep quote CTAs
     and project galleries up top; fitness/spa sites lead with
     services + social proof, etc.). Each sector maps to one of
     these, which drives both section ORDER and what each section is
     called — this is what the business-category picker actually
     changes structurally, not just color.
     ------------------------------------------------------------ */
  var LAYOUTS = {
    "default": {
      order: ["hero", "about", "services", "gallery", "testimonials", "contact"],
      hidden: { testimonials: true },
      ctaFallback: "Get in Touch",
      labels: {}
    },
    "menu-forward": { // Food & Drink
      order: ["hero", "gallery", "services", "testimonials", "about", "contact"],
      hidden: {},
      ctaFallback: "View Our Menu",
      labels: {
        gallery: { label: "Food & Atmosphere", eyebrow: "Food & Atmosphere", heading: "A taste of what's inside" },
        services: { label: "Menu", eyebrow: "Our Menu", heading: "What we're serving" }
      }
    },
    "trust-forward": { // Legal, Professional Services, Nonprofit/Faith
      order: ["hero", "testimonials", "about", "services", "gallery", "contact"],
      hidden: { gallery: true },
      ctaFallback: "Schedule a Consultation",
      labels: {
        testimonials: { label: "Client Results", eyebrow: "Client Results", heading: "What clients say" },
        services: { label: "Practice Areas", eyebrow: "How We Can Help", heading: "Practice areas" }
      }
    },
    "service-area-forward": { // Home & Trade Services, Automotive
      order: ["hero", "services", "gallery", "testimonials", "about", "contact"],
      hidden: {},
      ctaFallback: "Get a Free Quote",
      labels: {
        services: { label: "Services", eyebrow: "What We Do", heading: "Services we offer" },
        gallery: { label: "Recent Work", eyebrow: "Recent Work", heading: "See the difference" }
      }
    },
    "booking-forward": { // Health & Wellness, Beauty, Fitness, Education/Childcare, Pet Services
      order: ["hero", "services", "gallery", "testimonials", "about", "contact"],
      hidden: {},
      ctaFallback: "Book Now",
      labels: {
        gallery: { label: "Our Space", eyebrow: "Our Space", heading: "Take a look inside" }
      }
    },
    "product-grid": { // Retail, Arts & Crafts, Agriculture/Outdoor, Specialty & Cottage Food
      order: ["hero", "gallery", "services", "about", "testimonials", "contact"],
      hidden: { testimonials: true },
      ctaFallback: "Shop Now",
      labels: {
        gallery: { label: "Shop", eyebrow: "Shop the Collection", heading: "Customer favorites" },
        services: { label: "Pricing", eyebrow: "Popular Picks", heading: "What we offer" }
      }
    },
    "portfolio-forward": { // Events & Entertainment
      order: ["hero", "gallery", "testimonials", "about", "services", "contact"],
      hidden: {},
      ctaFallback: "Check Availability",
      labels: {
        gallery: { label: "Portfolio", eyebrow: "Our Work", heading: "See it in action" },
        services: { label: "Packages", eyebrow: "Packages & Pricing", heading: "What's included" }
      }
    },
    "hospitality-forward": { // Hospitality & Lodging
      order: ["hero", "gallery", "services", "testimonials", "about", "contact"],
      hidden: {},
      ctaFallback: "Check Availability",
      labels: {
        gallery: { label: "Gallery", eyebrow: "Take a Look Around", heading: "Your home away from home" },
        services: { label: "Rooms & Rates", eyebrow: "Rooms & Rates", heading: "Find your stay" }
      }
    }
  };

  var SECTOR_LAYOUT = {
    "Food & Drink": "menu-forward",
    "Retail & Shopping": "product-grid",
    "Health & Wellness": "booking-forward",
    "Beauty & Personal Care": "booking-forward",
    "Home & Trade Services": "service-area-forward",
    "Automotive": "service-area-forward",
    "Professional Services": "trust-forward",
    "Legal Services": "trust-forward",
    "Education & Childcare": "booking-forward",
    "Fitness & Recreation": "booking-forward",
    "Pet Services": "booking-forward",
    "Events & Entertainment": "portfolio-forward",
    "Arts, Crafts & Creative": "product-grid",
    "Agriculture & Outdoor": "product-grid",
    "Hospitality & Lodging": "hospitality-forward",
    "Nonprofit, Community & Faith": "trust-forward",
    "Transportation & Logistics": "default",
    "Manufacturing & Wholesale": "default",
    "Technology & Digital": "default",
    "Specialty & Cottage Food": "product-grid"
  };

  // Sector -> a simple, recognizable currentColor icon used in hero art
  // and gallery/photo placeholders, so even before real photos go in,
  // the preview reads as "this business" rather than a generic template.
  var SECTOR_ICON = {
    "Food & Drink": '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
    "Retail & Shopping": '<path d="M6 2 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5Z"/><path d="M3 7h18"/><path d="M16 11a4 4 0 0 1-8 0"/>',
    "Health & Wellness": '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    "Beauty & Personal Care": '<path d="m6 9 6 6"/><path d="m6 15 6-6"/><circle cx="4" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><path d="M20 4 8.5 15.5"/><path d="M14.5 9.5 20 15"/>',
    "Home & Trade Services": '<path d="m14.7 6.3-1.4 1.4a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1.4-1.4a3.5 3.5 0 0 1-3 5.5l-6 6a1.5 1.5 0 0 1-2-2l6-6a3.5 3.5 0 0 1 5.5-3Z"/>',
    "Automotive": '<path d="M19 17h2v-4l-3-5H6L3 13v4h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
    "Professional Services": '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    "Legal Services": '<path d="M12 3v18"/><path d="m4 6 4-1 4 1"/><path d="m16 6 4-1 4 1"/><path d="M2 6h6l-3 7a3.5 3.5 0 0 1-3-7Z"/><path d="M22 6h-6l3 7a3.5 3.5 0 0 0 3-7Z"/><path d="M6 21h12"/>',
    "Education & Childcare": '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    "Fitness & Recreation": '<path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-3-3"/><path d="M3 3l3 3"/><path d="M18 3l3 3-3 3-3-3Z"/><path d="M3 18l3 3 3-3-3-3Z"/>',
    "Pet Services": '<circle cx="6" cy="9" r="2"/><circle cx="11" cy="5" r="2"/><circle cx="16" cy="9" r="2"/><path d="M9 18c-2 0-4-1.5-4-3.5S6.5 12 9 12c1 0 1.5.5 2.5.5S13 12 14 12c2.5 0 4 1 4 2.5S16 18 14 18a4 4 0 0 1-2.5-1 4 4 0 0 1-2.5 1Z"/>',
    "Events & Entertainment": '<path d="M2 16.5A8.5 8.5 0 0 1 10.5 8h3A8.5 8.5 0 0 1 22 16.5"/><circle cx="12" cy="4" r="2"/><path d="M5 20h14"/>',
    "Arts, Crafts & Creative": '<path d="M12 2a10 10 0 1 0 0 20c1 0 2-.5 2-2 0-.7-.4-1-.4-1.6 0-.8.7-1.4 1.5-1.4H17a3 3 0 0 0 3-3c0-5-3.5-9-8-9Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="8" r="1"/>',
    "Agriculture & Outdoor": '<path d="M12 22c6-3 8-8 8-13a5 5 0 0 0-8-4 5 5 0 0 0-8 4c0 5 2 10 8 13Z"/><path d="M12 22V9"/>',
    "Hospitality & Lodging": '<path d="M3 18v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9"/><path d="M13 18v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M1 18h22"/><circle cx="7" cy="10" r="1"/>',
    "Nonprofit, Community & Faith": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    "Transportation & Logistics": '<rect x="1" y="7" width="15" height="10" rx="1"/><path d="M16 10h4l3 3v4h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/>',
    "Manufacturing & Wholesale": '<path d="m2 20 4-9 4 6 3-4 4 7Z"/><path d="M2 20h20"/><path d="M6 11V5l3 2 3-3 3 3 3-2v6"/>',
    "Technology & Digital": '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M8 21h8"/><path d="M12 16v5"/>',
    "Specialty & Cottage Food": '<path d="M8 3h8"/><path d="M9 3v5.5L4.5 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.8-2.9L15 8.5V3"/>',
    "default": '<path d="M11 2 3 14h7l-1 8 9-13h-7Z"/>'
  };

  function currentSectorIcon() {
    var sector = state.matchedCategory && state.matchedCategory.sector;
    return SECTOR_ICON[sector] || SECTOR_ICON["default"];
  }

  function sectorIconSvg(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + currentSectorIcon() + "</svg>";
  }

  function layoutCfg() {
    return LAYOUTS[state.layout] || LAYOUTS["default"];
  }

  // Merge a section's default meta with any layout-specific override.
  function meta(key) {
    var base = SECTION_META[key] || { label: key };
    var override = (layoutCfg().labels && layoutCfg().labels[key]) || {};
    return {
      label: override.label || base.label,
      eyebrow: override.eyebrow || base.eyebrow,
      heading: override.heading || base.heading,
      locked: base.locked
    };
  }

  var NAME_TO_KEY = {};
  PALETTES.forEach(function (p) { NAME_TO_KEY.palette = NAME_TO_KEY.palette || {}; NAME_TO_KEY.palette[p.name] = p.key; });
  STYLES.forEach(function (s) { NAME_TO_KEY.style = NAME_TO_KEY.style || {}; NAME_TO_KEY.style[s.name] = s.key; });

  function byKey(list, key) {
    for (var i = 0; i < list.length; i++) { if (list[i].key === key) return list[i]; }
    return list[0];
  }

  var state = {
    info: {},
    matchedCategory: null,
    palette: "warm-trustworthy",
    style: "friendly-warm",
    layout: "default",
    sectionOrder: ["hero", "about", "services", "gallery", "contact"],
    sectionVisible: { hero: true, about: true, services: true, gallery: true, testimonials: true, contact: true },
    photoStyle: "illustration"
  };

  document.addEventListener("DOMContentLoaded", function () {
    wireStep1();
    wirePanel();
  });

  // ---------------- Step 1: info form ----------------

  function wireStep1() {
    var form = document.getElementById("infoForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      collectInfo();
      applySmartDefaults();
      goToStep2();
    });
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function checkedList(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (el) { return el.checked; }).map(function (el) { return el.value; });
  }

  function radioVal(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function collectInfo() {
    state.info = {
      bizName: val("bizName"),
      contactName: val("contactName"),
      phone: val("phone"),
      email: val("email"),
      currentSite: val("currentSite"),
      category: val("business-category") || val("business-category-input"),
      categoryRaw: val("business-category-raw"),
      description: val("bizDescription"),
      goals: checkedList(".goal-chk"),
      orderPref: radioVal("orderStyle"),
      pricing: val("pricing"),
      story: val("story"),
      testimonials: val("testimonials"),
      logo: radioVal("logo") || "No logo yet",
      notes: val("notes")
    };
  }

  function applySmartDefaults() {
    var data = window.MWS_BUSINESS_CATEGORIES;
    var catName = state.info.category;
    var sectorInfo = null;

    if (data && catName) {
      var flatMatch = data.flat.filter(function (c) { return c.name === catName; })[0];
      if (flatMatch) sectorInfo = flatMatch;
    }
    if (!sectorInfo && data && state.info.categoryRaw) {
      var m = data.match(state.info.categoryRaw);
      if (m) sectorInfo = m;
    }

    state.matchedCategory = sectorInfo;

    if (sectorInfo) {
      var paletteName = sectorInfo.paletteDefault;
      var styleName = sectorInfo.styleDefault;
      if (paletteName && NAME_TO_KEY.palette[paletteName]) state.palette = NAME_TO_KEY.palette[paletteName];
      if (styleName && NAME_TO_KEY.style[styleName]) state.style = NAME_TO_KEY.style[styleName];
    }

    // The business category also picks a structural layout — section order,
    // section names, and default CTA — modeled on how real sites in that
    // industry are actually built (a restaurant leads with food photos and
    // a menu; a law firm leads with credibility before practice areas; a
    // contractor keeps quote CTAs and project photos up top; etc.)
    var archetype = (sectorInfo && SECTOR_LAYOUT[sectorInfo.sector]) || "default";
    state.layout = archetype;
    var cfg = LAYOUTS[archetype] || LAYOUTS["default"];
    state.sectionOrder = cfg.order.slice();
    var visible = { hero: true, about: true, services: true, gallery: true, testimonials: true, contact: true };
    Object.keys(cfg.hidden || {}).forEach(function (k) { if (cfg.hidden[k]) visible[k] = false; });
    state.sectionVisible = visible;
  }

  // ---------------- Step transition ----------------

  function goToStep2() {
    document.getElementById("step1").hidden = true;
    document.getElementById("step2").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    var heading = document.getElementById("previewIntro");
    if (heading) {
      heading.textContent = "Here's a first look at " + (state.info.bizName || "your business") + "'s new site.";
    }

    syncPanelControls();
    renderPreview();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var backBtn = document.getElementById("backToInfo");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        document.getElementById("step2").hidden = true;
        document.getElementById("step1").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  // ---------------- Floating panel ----------------

  function wirePanel() {
    var paletteRow = document.getElementById("paletteOptions");
    var styleRow = document.getElementById("styleOptions");
    var photoRow = document.getElementById("photoOptions");
    var sectionList = document.getElementById("sectionList");

    if (paletteRow) {
      PALETTES.forEach(function (p) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "swatch-btn";
        btn.setAttribute("data-key", p.key);
        btn.title = p.name;
        btn.innerHTML =
          '<span class="swatch-dot" style="background:' + p.primary + '"></span>' +
          '<span class="swatch-dot" style="background:' + p.secondary + ';border:1px solid #ddd;"></span>' +
          '<span class="swatch-dot" style="background:' + p.accent + '"></span>' +
          '<span class="swatch-label">' + p.name + "</span>";
        btn.addEventListener("click", function () {
          state.palette = p.key;
          syncPanelControls();
          renderPreview();
        });
        paletteRow.appendChild(btn);
      });
    }

    if (styleRow) {
      STYLES.forEach(function (s) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "style-btn";
        btn.setAttribute("data-key", s.key);
        btn.style.fontFamily = s.heading;
        btn.textContent = s.name;
        btn.addEventListener("click", function () {
          state.style = s.key;
          syncPanelControls();
          renderPreview();
        });
        styleRow.appendChild(btn);
      });
    }

    if (photoRow) {
      PHOTO_STYLES.forEach(function (p) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "photo-btn";
        btn.setAttribute("data-key", p.key);
        btn.innerHTML = "<strong>" + p.name + "</strong><span>" + p.note + "</span>";
        btn.addEventListener("click", function () {
          state.photoStyle = p.key;
          syncPanelControls();
          renderPreview();
        });
        photoRow.appendChild(btn);
      });
    }

    renderSectionList();

    // Panel tabs
    document.querySelectorAll(".panel-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".panel-tab").forEach(function (t) { t.classList.remove("active"); });
        document.querySelectorAll(".panel-pane").forEach(function (p) { p.classList.remove("active"); });
        tab.classList.add("active");
        document.getElementById("pane-" + tab.getAttribute("data-pane")).classList.add("active");
      });
    });

    // Mobile panel expand/collapse
    var toggle = document.getElementById("panelToggle");
    var panel = document.getElementById("customizePanel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("expanded");
      });
    }

    // Final submit
    var sendBtn = document.getElementById("sendToBrett");
    if (sendBtn) sendBtn.addEventListener("click", sendSummary);
    var copyBtn = document.getElementById("copySummary");
    if (copyBtn) copyBtn.addEventListener("click", copySummary);
  }

  function syncPanelControls() {
    document.querySelectorAll(".swatch-btn").forEach(function (btn) {
      btn.classList.toggle("selected", btn.getAttribute("data-key") === state.palette);
    });
    document.querySelectorAll(".style-btn").forEach(function (btn) {
      btn.classList.toggle("selected", btn.getAttribute("data-key") === state.style);
    });
    document.querySelectorAll(".photo-btn").forEach(function (btn) {
      btn.classList.toggle("selected", btn.getAttribute("data-key") === state.photoStyle);
    });
  }

  function renderSectionList() {
    var list = document.getElementById("sectionList");
    if (!list) return;
    list.innerHTML = "";

    state.sectionOrder.forEach(function (key, i) {
      var m = meta(key);
      var row = document.createElement("div");
      row.className = "section-row" + (state.sectionVisible[key] ? "" : " hidden-row");

      var moveButtons = "";
      if (!m.locked) {
        moveButtons =
          '<button type="button" class="mini-btn" data-action="up" data-key="' + key + '" ' + (i <= 1 ? "disabled" : "") + ' aria-label="Move up">↑</button>' +
          '<button type="button" class="mini-btn" data-action="down" data-key="' + key + '" ' + (i >= state.sectionOrder.length - 1 ? "disabled" : "") + ' aria-label="Move down">↓</button>';
      }

      row.innerHTML =
        '<span class="section-name">' + m.label + (m.locked ? ' <em>(always first)</em>' : "") + '</span>' +
        '<span class="section-controls">' +
          moveButtons +
          (m.locked ? "" : '<button type="button" class="mini-btn toggle-btn" data-action="toggle" data-key="' + key + '">' + (state.sectionVisible[key] ? "Hide" : "Show") + '</button>') +
        '</span>';

      list.appendChild(row);
    });

    list.querySelectorAll(".mini-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        var key = btn.getAttribute("data-key");
        var idx = state.sectionOrder.indexOf(key);

        if (action === "up" && idx > 1) {
          var tmp = state.sectionOrder[idx - 1];
          state.sectionOrder[idx - 1] = state.sectionOrder[idx];
          state.sectionOrder[idx] = tmp;
        } else if (action === "down" && idx < state.sectionOrder.length - 1) {
          var tmp2 = state.sectionOrder[idx + 1];
          state.sectionOrder[idx + 1] = state.sectionOrder[idx];
          state.sectionOrder[idx] = tmp2;
        } else if (action === "toggle") {
          state.sectionVisible[key] = !state.sectionVisible[key];
        }

        renderSectionList();
        renderPreview();
      });
    });
  }

  // ---------------- Preview rendering ----------------

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function primaryCTA() {
    var goals = state.info.goals || [];
    for (var i = 0; i < GOAL_PRIORITY.length; i++) {
      if (goals.indexOf(GOAL_PRIORITY[i]) !== -1) {
        switch (GOAL_PRIORITY[i]) {
          case "Get customers to call": return "Call Now";
          case "Get bookings": return "Book a Consultation";
          case "Get customers to order/buy online": return "Order Now";
          case "Get customers to visit": return "Get Directions";
          case "Look professional online": return "Learn More";
        }
      }
    }
    return layoutCfg().ctaFallback || "Get in Touch";
  }

  function slugify(name) {
    var s = String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
    return s.slice(0, 24) || "yourbusiness";
  }

  // Small inline icon set (currentColor-based, so they pick up palette color automatically)
  var ICONS = {
    phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    camera: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  };

  function trustItems() {
    var goals = state.info.goals || [];
    var items = [];
    if (goals.indexOf("Get customers to call") !== -1) items.push("Fast response time");
    if (goals.indexOf("Get bookings") !== -1) items.push("Easy online booking");
    if (goals.indexOf("Get customers to order/buy online") !== -1) items.push("Order in minutes");
    if (goals.indexOf("Get customers to visit") !== -1) items.push("Locally owned &amp; operated");
    if (!items.length) items.push("Trusted by the community", "Quality you can count on");
    while (items.length < 3) items.push(["Satisfaction guaranteed", "Friendly, local service", "Years of experience"][items.length]);
    return items.slice(0, 3);
  }

  function heroArt() {
    var style = state.photoStyle;
    if (style === "placeholder") {
      return (
        '<div class="pv-media pv-media-placeholder">' +
          '<div class="pv-media-icon">' + sectorIconSvg(30) + "</div>" +
          '<span>Your photo goes here</span>' +
        "</div>"
      );
    }
    if (style === "stock") {
      return (
        '<div class="pv-media pv-media-stock">' +
          '<div class="pv-media-icon">' + sectorIconSvg(30) + "</div>" +
          '<span>High-quality stock photography</span>' +
        "</div>"
      );
    }
    return (
      '<div class="pv-media pv-media-illo">' +
        '<div class="illo-blob"></div>' +
        '<div class="illo-shape illo-shape-1"></div>' +
        '<div class="illo-shape illo-shape-2"></div>' +
        '<div class="illo-ring"></div>' +
        '<div class="illo-icon">' + sectorIconSvg(46) + "</div>" +
      "</div>"
    );
  }

  function heroBg() {
    var style = state.photoStyle;
    if (style === "placeholder" || style === "stock") {
      var label = style === "stock" ? "High-quality stock photography — full width" : "Your photo goes here — full width";
      return (
        '<div class="pv-hero-photo-slot">' +
          '<div class="pv-hero-illo-grain"></div>' +
          '<div class="pv-hero-photo-icon">' + sectorIconSvg(48) + "</div>" +
          "<span>" + label + "</span>" +
        "</div>"
      );
    }
    return (
      '<div class="pv-hero-illo-bg">' +
        '<div class="pv-hero-illo-aurora"></div>' +
        '<div class="pv-hero-illo-grain"></div>' +
        '<div class="pv-hero-illo-icon">' + sectorIconSvg(340) + "</div>" +
      "</div>"
    );
  }

  function galleryTile(i) {
    var style = state.photoStyle;
    if (style === "illustration") {
      return '<div class="pv-gallery-tile illo-tile-' + (i % 3) + '">' + sectorIconSvg(22) + "</div>";
    }
    var label = style === "stock" ? "Stock photo" : "Your photo";
    return (
      '<div class="pv-gallery-tile photo-tile">' +
        '<div class="tile-icon">' + sectorIconSvg(24) + "</div>" +
        "<span>" + label + "</span>" +
      "</div>"
    );
  }

  function renderNav(name) {
    var initial = (name.trim().charAt(0) || "M").toUpperCase();
    var links = state.sectionOrder.filter(function (k) { return state.sectionVisible[k] && k !== "hero"; });
    var navLinks = links.map(function (k) { return '<a href="#' + k + '">' + meta(k).label + "</a>"; }).join("");
    return (
      '<header class="pv-nav">' +
        '<div class="pv-nav-inner">' +
          '<a href="#" class="pv-brand"><span class="pv-brand-badge">' + initial + "</span>" + escapeHtml(name) + "</a>" +
          '<nav class="pv-nav-links">' + navLinks + "</nav>" +
          '<a href="#contact" class="pv-btn pv-btn-primary pv-btn-sm">' + primaryCTA() + "</a>" +
        "</div>" +
      "</header>"
    );
  }

  function renderHero() {
    var name = escapeHtml(state.info.bizName) || "Your Business Name";
    var desc = escapeHtml(state.info.description) || "Tell your customers what makes you different — this is where your story starts.";
    return (
      '<section class="pv-section pv-hero" id="hero">' +
        '<div class="pv-hero-bg">' + heroBg() + "</div>" +
        '<div class="pv-hero-scrim"></div>' +
        '<div class="pv-hero-inner">' +
          '<span class="pv-eyebrow pv-eyebrow-hero">Welcome to</span>' +
          "<h1>" + name + "</h1>" +
          "<p>" + desc + "</p>" +
          '<div class="pv-cta-row">' +
            '<a href="#contact" class="pv-btn pv-btn-primary">' + primaryCTA() + '</a>' +
            '<a href="#about" class="pv-btn pv-btn-outline pv-btn-outline-hero">Learn More</a>' +
          "</div>" +
          '<div class="pv-trust-row pv-trust-row-hero">' + trustItems().map(function (t) { return '<span class="pv-trust-item">' + ICONS.check + "<span>" + t + "</span></span>"; }).join("") + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderAbout() {
    var name = escapeHtml(state.info.bizName) || "We";
    var story = escapeHtml(state.info.story) || (escapeHtml(state.info.description) || "This is where your story goes — how you got started, and what makes " + name + " different from anyone else in town.");
    var m = meta("about");
    return (
      '<section class="pv-section pv-about" id="about">' +
        '<div class="pv-about-inner">' +
          '<div>' +
            '<span class="pv-eyebrow">' + m.eyebrow + "</span>" +
            "<h2>" + m.heading + "</h2>" +
            "<p>" + story + "</p>" +
          "</div>" +
          '<div class="pv-about-art">' + heroArt() + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function parsePriceLine(line) {
    var m = line.match(/^(.*?)[\s–—-]*(\$[\d.,]+(?:\s*\/\s*\w+)?|\bfree\b)\s*$/i);
    if (m && m[1].trim()) return { title: m[1].trim(), price: m[2] };
    return { title: line, price: "" };
  }

  function renderServices() {
    var pricing = state.info.pricing;
    var lines;
    if (pricing) {
      lines = pricing.split(/\n|,/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 6);
    } else {
      lines = ["Service / Product One", "Service / Product Two", "Service / Product Three"];
    }
    var cards = lines.map(function (line) {
      var p = parsePriceLine(line);
      return (
        '<div class="pv-price-card">' +
          '<span class="pv-price-title">' + escapeHtml(p.title) + "</span>" +
          (p.price ? '<span class="pv-price-amount">' + escapeHtml(p.price) + "</span>" : "") +
        "</div>"
      );
    }).join("");
    var sm = meta("services");
    return (
      '<section class="pv-section pv-services" id="services">' +
        '<span class="pv-eyebrow">' + sm.eyebrow + "</span>" +
        "<h2>" + sm.heading + "</h2>" +
        '<div class="pv-price-grid">' + cards + "</div>" +
      "</section>"
    );
  }

  function renderGallery() {
    var tiles = "";
    for (var i = 0; i < 6; i++) tiles += galleryTile(i);
    var gm = meta("gallery");
    return (
      '<section class="pv-section pv-gallery" id="gallery">' +
        '<span class="pv-eyebrow">' + gm.eyebrow + "</span>" +
        "<h2>" + gm.heading + "</h2>" +
        '<div class="pv-gallery-grid">' + tiles + "</div>" +
      "</section>"
    );
  }

  function renderTestimonials() {
    var raw = (state.info.testimonials || "").trim();
    var tm = meta("testimonials");
    var body;
    if (raw) {
      var quotes = raw.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3);
      body = '<div class="pv-testimonial-grid">' + quotes.map(function (q) {
        return (
          '<div class="pv-testimonial-card">' +
            '<div class="pv-stars">★★★★★</div>' +
            '<p class="pv-quote">&ldquo;' + escapeHtml(q.replace(/^["“]|["”]$/g, "")) + '&rdquo;</p>' +
          "</div>"
        );
      }).join("") + "</div>";
    } else {
      body = '<div class="pv-testimonial-grid">' + [0, 1, 2].map(function () {
        return (
          '<div class="pv-testimonial-card pv-testimonial-placeholder">' +
            '<div class="pv-stars">★★★★★</div>' +
            '<p class="pv-quote">Your customer reviews will go here.</p>' +
          "</div>"
        );
      }).join("") + "</div>";
    }
    return (
      '<section class="pv-section pv-testimonials" id="testimonials">' +
        '<span class="pv-eyebrow">' + tm.eyebrow + "</span>" +
        "<h2>" + tm.heading + "</h2>" +
        body +
      "</section>"
    );
  }

  function renderContact() {
    var phone = escapeHtml(state.info.phone) || "(618) 555-0100";
    var email = escapeHtml(state.info.email) || "you@yourbusiness.com";
    var cm = meta("contact");
    return (
      '<section class="pv-section pv-contact" id="contact">' +
        '<div class="pv-contact-inner">' +
          '<div class="pv-contact-copy">' +
            '<span class="pv-eyebrow">' + cm.eyebrow + "</span>" +
            "<h2>" + cm.heading + "</h2>" +
            "<p>Reach out any time — we'd love to hear from you.</p>" +
            '<div class="pv-contact-detail">' + ICONS.phone + "<span>" + phone + "</span></div>" +
            '<div class="pv-contact-detail">' + ICONS.mail + "<span>" + email + "</span></div>" +
            '<div class="pv-contact-detail">' + ICONS.clock + "<span>Mon–Sat, 9am–6pm</span></div>" +
            '<a href="#" class="pv-btn pv-btn-primary" style="margin-top:18px;display:inline-flex;">' + primaryCTA() + "</a>" +
          "</div>" +
          '<div class="pv-map">' + ICONS.pin + '<span>Find us on the map</span></div>' +
        "</div>" +
      "</section>"
    );
  }

  function renderFooter(name) {
    var links = state.sectionOrder.filter(function (k) { return state.sectionVisible[k] && k !== "hero"; });
    var navLinks = links.map(function (k) { return '<a href="#' + k + '">' + meta(k).label + "</a>"; }).join("");
    return (
      '<footer class="pv-footer">' +
        '<div class="pv-footer-inner">' +
          '<div class="pv-footer-brand">' + escapeHtml(name) + "</div>" +
          '<nav class="pv-footer-links">' + navLinks + "</nav>" +
        "</div>" +
        '<div class="pv-footer-bottom">&copy; ' + new Date().getFullYear() + " " + escapeHtml(name) + ". All rights reserved.</div>" +
      "</footer>"
    );
  }

  var RENDERERS = { hero: renderHero, about: renderAbout, services: renderServices, gallery: renderGallery, testimonials: renderTestimonials, contact: renderContact };

  function buildPreviewDocument() {
    var palette = byKey(PALETTES, state.palette);
    var styleObj = byKey(STYLES, state.style);
    var name = state.info.bizName || "Your Business";
    var r = styleObj.radius;

    var body = renderNav(name);
    state.sectionOrder.forEach(function (key) {
      if (state.sectionVisible[key] && RENDERERS[key]) body += RENDERERS[key]();
    });
    body += renderFooter(name);

    var css = "" +
      "*{box-sizing:border-box;}" +
      "html{scroll-behavior:smooth;}" +
      "body{margin:0;font-family:" + styleObj.body + ";color:#33322f;background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;}" +
      "h1,h2{font-family:" + styleObj.heading + ";font-weight:" + styleObj.weight + ";color:" + palette.primary + ";margin:0 0 12px;line-height:1.15;}" +
      "h1{font-size:clamp(1.9rem,4.6vw,3rem);}h2{font-size:clamp(1.4rem,2.6vw,1.9rem);}" +
      "p{margin:0 0 10px;color:#5a5852;max-width:540px;}" +
      "img{max-width:100%;display:block;}" +
      ".pv-section{padding:56px 40px;scroll-margin-top:76px;}" +
      ".pv-eyebrow{display:inline-block;font-family:" + styleObj.heading + ";font-weight:700;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:" + palette.primary + ";background:" + palette.accent + "26;padding:6px 15px;border-radius:" + r.pill + ";margin-bottom:14px;}" +
      /* Nav */
      ".pv-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.96);backdrop-filter:blur(6px);border-bottom:1px solid rgba(0,0,0,0.07);}" +
      ".pv-nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 40px;}" +
      ".pv-brand{display:flex;align-items:center;gap:10px;font-family:" + styleObj.heading + ";font-weight:700;font-size:1.05rem;color:" + palette.primary + ";text-decoration:none;}" +
      ".pv-brand-badge{width:32px;height:32px;border-radius:" + r.sm + ";background:" + palette.primary + ";color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}" +
      ".pv-nav-links{display:flex;gap:24px;}" +
      ".pv-nav-links a{font-family:" + styleObj.heading + ";font-weight:600;font-size:0.9rem;color:#4b4a45;text-decoration:none;}" +
      ".pv-nav-links a:hover{color:" + palette.primary + ";}" +
      /* Buttons */
      ".pv-btn{display:inline-flex;align-items:center;gap:6px;font-family:" + styleObj.heading + ";font-weight:" + styleObj.weight + ";font-size:0.92rem;padding:13px 26px;border-radius:" + r.pill + ";border:2px solid transparent;cursor:pointer;text-decoration:none;transition:transform .15s;}" +
      ".pv-btn:hover{transform:translateY(-2px);}" +
      ".pv-btn-primary{background:" + palette.accent + ";color:" + palette.primary + ";}" +
      ".pv-btn-outline{background:transparent;border-color:" + palette.primary + ";color:" + palette.primary + ";}" +
      ".pv-btn-sm{padding:9px 18px;font-size:0.82rem;}" +
      ".pv-cta-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:22px;}" +
      /* Hero — full-bleed, edge to edge */
      ".pv-hero{position:relative;overflow:hidden;padding:0;min-height:clamp(440px,58vw,640px);display:flex;align-items:center;}" +
      ".pv-hero-bg{position:absolute;inset:0;z-index:0;}" +
      ".pv-hero-illo-bg{position:absolute;inset:0;background:linear-gradient(135deg," + palette.primary + " 0%," + palette.primary + " 55%,#000000 150%);overflow:hidden;}" +
      ".pv-hero-illo-aurora{position:absolute;inset:-15%;background:radial-gradient(circle at 18% 22%," + palette.accent + "70 0%,transparent 42%),radial-gradient(circle at 82% 15%," + palette.secondary + "55 0%,transparent 48%),radial-gradient(circle at 65% 88%," + palette.accent + "50 0%,transparent 52%),radial-gradient(circle at 10% 90%," + palette.secondary + "40 0%,transparent 45%);filter:blur(46px);}" +
      ".pv-hero-illo-grain{position:absolute;inset:0;opacity:0.15;mix-blend-mode:overlay;background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>');}" +
      ".pv-hero-illo-icon{position:absolute;right:-50px;bottom:-50px;color:rgba(255,255,255,0.16);}" +
      ".pv-hero-illo-icon svg{display:block;}" +
      ".pv-hero-photo-slot{position:absolute;inset:0;background:linear-gradient(150deg," + palette.primary + "cc," + palette.primary + "f2);border:2px dashed rgba(255,255,255,0.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;}" +
      ".pv-hero-photo-icon{color:rgba(255,255,255,0.45);}" +
      ".pv-hero-photo-slot span{font-family:" + styleObj.body + ";font-size:0.95rem;font-weight:600;letter-spacing:0.02em;color:rgba(255,255,255,0.6);}" +
      ".pv-hero-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.05) 45%,rgba(0,0,0,0.12) 100%);pointer-events:none;}" +
      ".pv-hero-inner{position:relative;z-index:2;max-width:640px;margin:0 auto;padding:110px 40px;width:100%;}" +
      ".pv-hero-inner h1,.pv-hero-inner p{color:#fff;}" +
      ".pv-hero-inner p{max-width:520px;color:rgba(255,255,255,0.88);}" +
      ".pv-eyebrow-hero{background:rgba(255,255,255,0.18);color:#fff;backdrop-filter:blur(3px);}" +
      ".pv-btn-outline-hero{border-color:rgba(255,255,255,0.75);color:#fff;}" +
      ".pv-trust-row{display:flex;gap:22px;flex-wrap:wrap;margin-top:30px;padding-top:24px;border-top:1px solid rgba(0,0,0,0.08);}" +
      ".pv-trust-row-hero{border-top-color:rgba(255,255,255,0.28);}" +
      ".pv-trust-item{display:flex;align-items:center;gap:8px;font-family:" + styleObj.heading + ";font-weight:700;font-size:0.82rem;color:" + palette.primary + ";}" +
      ".pv-trust-row-hero .pv-trust-item{color:#fff;}" +
      ".pv-trust-item svg{flex-shrink:0;color:" + palette.accent + ";}" +
      /* Media (hero art / placeholder / stock) */
      ".pv-media{position:relative;width:100%;aspect-ratio:1/0.9;border-radius:" + r.lg + ";display:flex;align-items:center;justify-content:center;overflow:hidden;}" +
      ".pv-media-illo{background:#fff;box-shadow:0 20px 50px rgba(0,0,0,0.10);}" +
      ".illo-blob{position:absolute;width:75%;height:75%;background:" + palette.secondary + ";border-radius:50% 45% 55% 50%/50% 55% 45% 50%;}" +
      ".illo-shape{position:absolute;}" +
      ".illo-shape-1{width:46%;height:46%;background:" + palette.primary + ";top:8%;left:8%;border-radius:" + r.lg + ";}" +
      ".illo-shape-2{width:34%;height:34%;background:" + palette.accent + ";bottom:10%;right:10%;border-radius:" + r.md + ";}" +
      ".illo-ring{position:absolute;width:22%;height:22%;border:5px solid " + palette.primary + ";border-radius:50%;top:42%;right:18%;}" +
      ".illo-icon{position:relative;color:" + palette.primary + ";background:#fff;border-radius:50%;width:78px;height:78px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,0.12);}" +
      ".pv-media-placeholder,.pv-media-stock{background:linear-gradient(150deg," + palette.primary + "14," + palette.accent + "1f);border:1.5px dashed " + palette.primary + "40;flex-direction:column;gap:10px;color:" + palette.primary + "99;}" +
      ".pv-media-icon{color:" + palette.primary + "80;}" +
      ".pv-media span{font-family:" + styleObj.body + ";font-size:0.85rem;font-weight:600;text-align:center;padding:0 20px;}" +
      /* About */
      ".pv-about-inner{display:grid;grid-template-columns:1.1fr 0.9fr;gap:44px;align-items:center;max-width:1120px;margin:0 auto;}" +
      ".pv-about-art .pv-media{aspect-ratio:1/0.8;}" +
      /* Services */
      ".pv-services{max-width:1120px;margin:0 auto;}" +
      ".pv-price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-top:24px;}" +
      ".pv-price-card{background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:" + r.md + ";padding:20px;box-shadow:0 6px 18px rgba(0,0,0,0.05);display:flex;flex-direction:column;gap:8px;}" +
      ".pv-price-title{font-family:" + styleObj.heading + ";font-weight:700;color:#2b2a27;font-size:0.98rem;}" +
      ".pv-price-amount{font-family:" + styleObj.heading + ";font-weight:" + styleObj.weight + ";color:" + palette.primary + ";font-size:1.3rem;}" +
      /* Gallery */
      ".pv-gallery{max-width:1120px;margin:0 auto;}" +
      ".pv-gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px;}" +
      ".pv-gallery-tile{aspect-ratio:1;border-radius:" + r.md + ";}" +
      ".illo-tile-0{background:" + palette.primary + ";color:#fff;}" +
      ".illo-tile-1{background:" + palette.accent + ";color:" + palette.primary + ";}" +
      ".illo-tile-2{background:linear-gradient(135deg," + palette.primary + "," + palette.accent + ");color:#fff;}" +
      ".pv-gallery-tile.illo-tile-0,.pv-gallery-tile.illo-tile-1,.pv-gallery-tile.illo-tile-2{display:flex;align-items:center;justify-content:center;opacity:0.92;}" +
      ".photo-tile{background:linear-gradient(150deg," + palette.primary + "12," + palette.accent + "1a);border:1.5px dashed " + palette.primary + "35;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:" + palette.primary + "80;}" +
      ".photo-tile span{font-family:" + styleObj.body + ";font-size:0.75rem;font-weight:600;}" +
      /* Testimonials */
      ".pv-testimonials{max-width:1120px;margin:0 auto;}" +
      ".pv-testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:24px;}" +
      ".pv-testimonial-card{background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:" + r.md + ";padding:22px;box-shadow:0 6px 18px rgba(0,0,0,0.05);}" +
      ".pv-stars{color:" + palette.accent + ";letter-spacing:2px;margin-bottom:10px;font-size:0.9rem;}" +
      ".pv-quote{font-family:" + styleObj.body + ";font-style:italic;color:#4b4a45;margin:0;max-width:none;}" +
      ".pv-testimonial-placeholder{border-style:dashed;border-color:" + palette.primary + "35;background:linear-gradient(150deg," + palette.primary + "0c," + palette.accent + "12);}" +
      ".pv-testimonial-placeholder .pv-stars,.pv-testimonial-placeholder .pv-quote{color:" + palette.primary + "70;font-style:normal;}" +
      /* Contact */
      ".pv-contact{background:" + palette.secondary + ";}" +
      ".pv-contact-inner{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center;max-width:1120px;margin:0 auto;}" +
      ".pv-contact-detail{display:flex;align-items:center;gap:12px;font-family:" + styleObj.heading + ";font-weight:700;color:" + palette.primary + ";margin-bottom:10px;font-size:0.92rem;}" +
      ".pv-map{aspect-ratio:1/0.7;border-radius:" + r.lg + ";background:linear-gradient(150deg," + palette.primary + "1a," + palette.accent + "22);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:" + palette.primary + ";font-family:" + styleObj.body + ";font-weight:600;font-size:0.85rem;}" +
      /* Footer */
      ".pv-footer{background:" + palette.primary + ";color:rgba(255,255,255,0.85);padding:40px;}" +
      ".pv-footer-inner{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;max-width:1120px;margin:0 auto 22px;}" +
      ".pv-footer-brand{font-family:" + styleObj.heading + ";font-weight:700;color:#fff;font-size:1.05rem;}" +
      ".pv-footer-links{display:flex;gap:20px;flex-wrap:wrap;}" +
      ".pv-footer-links a{color:rgba(255,255,255,0.8);text-decoration:none;font-size:0.88rem;}" +
      ".pv-footer-bottom{max-width:1120px;margin:0 auto;padding-top:18px;border-top:1px solid rgba(255,255,255,0.15);font-size:0.78rem;color:rgba(255,255,255,0.55);}" +
      /* Motion — scroll reveal + hover lift */
      ".pv-reveal{opacity:0;transform:translateY(26px);transition:opacity .65s cubic-bezier(.2,.7,.3,1),transform .65s cubic-bezier(.2,.7,.3,1);}" +
      ".pv-reveal.is-visible{opacity:1;transform:translateY(0);}" +
      ".pv-gallery-tile,.pv-testimonial-card,.pv-price-card{transition:transform .25s ease,box-shadow .25s ease;}" +
      ".pv-gallery-tile:hover{transform:translateY(-4px) scale(1.015);box-shadow:0 14px 30px rgba(0,0,0,0.16);}" +
      ".pv-testimonial-card:hover,.pv-price-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(0,0,0,0.10);}" +
      "@media(prefers-reduced-motion:reduce){.pv-reveal{transition:none;opacity:1;transform:none;}}" +
      /* Responsive */
      "@media(max-width:820px){.pv-about-inner,.pv-contact-inner{grid-template-columns:1fr;}.pv-hero{min-height:clamp(380px,88vw,520px);}.pv-hero-inner{padding:70px 24px;}.pv-nav-links{display:none;}.pv-gallery-grid{grid-template-columns:repeat(2,1fr);}.pv-section{padding:40px 22px;}.pv-nav-inner{padding:12px 22px;}}";

    var motionScript =
      "<script>" +
        "document.addEventListener('DOMContentLoaded',function(){" +
          "var items=Array.prototype.slice.call(document.querySelectorAll('.pv-section:not(.pv-hero) > *, .pv-gallery-tile, .pv-testimonial-card, .pv-price-card'));" +
          "items.forEach(function(el,i){el.classList.add('pv-reveal');el.style.transitionDelay=(Math.min(i%6,5)*0.06)+'s';});" +
          "if('IntersectionObserver' in window){" +
            "var io=new IntersectionObserver(function(entries){" +
              "entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}});" +
            "},{threshold:0.15,rootMargin:'0px 0px -40px 0px'});" +
            "items.forEach(function(el){io.observe(el);});" +
          "}else{items.forEach(function(el){el.classList.add('is-visible');});}" +
        "});" +
      "</script>";

    return (
      "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
      "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>" +
      "<link href=\"https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Lora:wght@400;600&family=Archivo:wght@600;700;800&display=swap\" rel=\"stylesheet\">" +
      "<style>" + css + "</style></head><body>" + body + motionScript + "</body></html>"
    );
  }

  function renderPreview() {
    var iframe = document.getElementById("previewCanvas");
    if (!iframe) return;
    iframe.srcdoc = buildPreviewDocument();

    var urlBar = document.getElementById("previewUrl");
    if (urlBar) urlBar.textContent = "www." + slugify(state.info.bizName) + ".com";
  }

  // ---------------- Final submission ----------------

  function buildFullSummary() {
    var palette = byKey(PALETTES, state.palette);
    var styleObj = byKey(STYLES, state.style);
    var photo = byKey(PHOTO_STYLES, state.photoStyle);
    var visibleOrder = state.sectionOrder.filter(function (k) { return state.sectionVisible[k]; }).map(function (k) { return SECTION_META[k].label; });
    var hidden = state.sectionOrder.filter(function (k) { return !state.sectionVisible[k]; }).map(function (k) { return SECTION_META[k].label; });
    var info = state.info;

    return (
      "NEW WEBSITE DEMO SUBMISSION\n" +
      "=================================\n\n" +
      "BUSINESS\n" +
      "Business name: " + (info.bizName || "(not provided)") + "\n" +
      "Contact name: " + (info.contactName || "(not provided)") + "\n" +
      "Phone: " + (info.phone || "(not provided)") + "\n" +
      "Email: " + (info.email || "(not provided)") + "\n" +
      "Current website: " + (info.currentSite || "None") + "\n" +
      "Business category: " + (info.category || "(not specified)") + (info.categoryRaw && info.categoryRaw !== info.category ? ' (typed as: "' + info.categoryRaw + '")' : "") + "\n" +
      "What they do: " + (info.description || "(not provided)") + "\n\n" +
      "SITE GOAL\n" +
      (info.goals && info.goals.length ? info.goals.join(", ") : "Not specified") + "\n" +
      "Online ordering preference: " + (info.orderPref || "Not specified") + "\n\n" +
      "PRICING/PACKAGES\n" + (info.pricing || "(not provided)") + "\n\n" +
      "BUSINESS STORY\n" + (info.story || "(not provided)") + "\n\n" +
      "TESTIMONIALS\n" + (info.testimonials || "(none provided)") + "\n\n" +
      "LOGO\n" + info.logo + "\n\n" +
      "ADDITIONAL NOTES\n" + (info.notes || "(none)") + "\n\n" +
      "SITE CUSTOMIZATION (chosen live in the demo)\n" +
      "Style: " + styleObj.name + "\n" +
      "Palette: " + palette.name + " (" + palette.primary + " / " + palette.secondary + " / " + palette.accent + ")\n" +
      "Photo treatment: " + photo.name + "\n" +
      "Sections, in order: " + visibleOrder.join(" → ") + "\n" +
      (hidden.length ? "Sections removed: " + hidden.join(", ") + "\n" : "")
    );
  }

  function sendSummary() {
    var summary = buildFullSummary();
    var bizName = state.info.bizName || "New client";
    var subject = encodeURIComponent("Website Demo — " + bizName);
    var body = encodeURIComponent(summary);
    window.location.href = "mailto:654bbr@gmail.com?subject=" + subject + "&body=" + body;
    var msg = document.getElementById("sendStatus");
    if (msg) {
      msg.textContent = "Opening your email app now — just hit send and Brett will follow up.";
      msg.hidden = false;
    }
  }

  function copySummary() {
    var summary = buildFullSummary();
    var msg = document.getElementById("sendStatus");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary).then(function () {
        if (msg) { msg.textContent = "Copied! Paste it into an email or text to 654bbr@gmail.com."; msg.hidden = false; }
      }).catch(function () {
        if (msg) { msg.textContent = "Could not copy automatically — please select and copy manually."; msg.hidden = false; }
      });
    }
  }

})();
