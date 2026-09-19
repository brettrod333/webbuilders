// Web Builders — shared site behavior

// Reveal the page (see the fade-in rules in css/style.css). Runs as
// soon as this script executes, which is as soon as the browser has
// parsed the page — typically well before images/fonts finish loading.
if (document.body) {
    document.body.classList.add("page-ready");
}

// Some mobile browsers try to restore the previous page's scroll position
// on a fresh navigation (especially from a link near the bottom of a long
// page), which can land a new page scrolled down instead of at the top.
// Force plain page loads (no #section in the URL) to start at the top,
// without interfering with real anchor links like index.html#about.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", function () {
    if (!window.location.hash) window.scrollTo(0, 0);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Contact form: client-side only (no backend wired up yet).
  // Builds a mailto: link from the fields so the message reaches
  // 654bbr@gmail.com immediately. Swap this for a real form
  // handler (e.g. Formspree, Netlify Forms) once the site is hosted.
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();
      var phone = form.querySelector("#phone").value.trim();
      var projectType = form.querySelector("#project-type").value;
      var message = form.querySelector("#message").value.trim();

      var categoryField = form.querySelector("#business-category");
      var categoryRawField = form.querySelector("#business-category-raw");
      var category = categoryField ? categoryField.value.trim() : "";
      var categoryRaw = categoryRawField ? categoryRawField.value.trim() : "";
      var categoryLine = "Business category: " + (category || "(not provided)");
      if (categoryRaw && categoryRaw !== category) {
        categoryLine += " (typed as: \"" + categoryRaw + "\")";
      }

      var subject = encodeURIComponent("New inquiry from " + name + " (" + projectType + ")");
      var body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "Project type: " + projectType + "\n" +
        categoryLine + "\n\n" +
        "Message:\n" + message
      );

      window.location.href = "mailto:654bbr@gmail.com?subject=" + subject + "&body=" + body;

      var success = document.getElementById("form-success");
      if (success) success.style.display = "block";
      form.reset();
    });
  }

  // Highlight the nav link for whichever section is in view
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = document.querySelectorAll(".main-nav a[href^='#']");

  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) current = section;
    });
    navLinks.forEach(function (link) {
      link.removeAttribute("aria-current");
      if (current && link.getAttribute("href") === "#" + current.id) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
  }

  // Scroll-reveal: fade/slide content in as it enters the viewport.
  // No animation library — a small IntersectionObserver + a CSS class.
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
    ".card, .price-card, .step, .about-hero > div, .contact-card, .form-card, .section-head"
  ));
  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = (Math.min(i % 6, 5) * 0.06) + "s";
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }
});
