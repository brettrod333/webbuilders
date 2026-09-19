/* ============================================================
   Web Builders — searchable business-category picker
   Type-to-filter combobox backed by MWS_BUSINESS_CATEGORIES.
   Falls back to fuzzy matching when what's typed isn't an exact
   category name, so a client can just describe their business in
   their own words and still land on the right category.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var data = window.MWS_BUSINESS_CATEGORIES;
  var root = document.getElementById("category-picker");
  if (!data || !root) return;

  var input = root.querySelector("#business-category-input");
  var hiddenValue = root.querySelector("#business-category");
  var hiddenRaw = root.querySelector("#business-category-raw");
  var listbox = root.querySelector("#category-listbox");
  var note = root.querySelector("#category-match-note");

  var activeIndex = -1;
  var currentOptions = []; // flat array of category names in DOM order
  var lastConfirmedValue = "";

  function closeList() {
    listbox.hidden = true;
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
  }

  function openList() {
    listbox.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function renderGroups(groups) {
    listbox.innerHTML = "";
    currentOptions = [];

    if (!groups.length) {
      var empty = document.createElement("div");
      empty.className = "category-empty";
      empty.textContent = "No exact match — keep typing, or press Enter and we'll match your own words to the closest category.";
      listbox.appendChild(empty);
      return;
    }

    groups.forEach(function (group) {
      var heading = document.createElement("div");
      heading.className = "category-group-label";
      heading.textContent = group.sector;
      listbox.appendChild(heading);

      group.categories.forEach(function (catName) {
        var opt = document.createElement("div");
        opt.className = "category-option";
        opt.setAttribute("role", "option");
        opt.setAttribute("data-value", catName);
        opt.id = "cat-opt-" + currentOptions.length;
        opt.textContent = catName;

        opt.addEventListener("mousedown", function (e) {
          // mousedown (not click) so it fires before the input's blur handler
          e.preventDefault();
          selectCategory(catName, true);
        });

        listbox.appendChild(opt);
        currentOptions.push(catName);
      });
    });
  }

  function highlightActive() {
    var opts = listbox.querySelectorAll(".category-option");
    opts.forEach(function (el, i) {
      if (i === activeIndex) {
        el.classList.add("active");
        el.scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", el.id);
      } else {
        el.classList.remove("active");
      }
    });
  }

  function showNote(message, tone) {
    note.hidden = false;
    note.textContent = message;
    note.className = "category-match-note" + (tone ? " " + tone : "");
  }

  function hideNote() {
    note.hidden = true;
    note.textContent = "";
  }

  function selectCategory(name, fromClick) {
    input.value = name;
    hiddenValue.value = name;
    if (hiddenRaw) hiddenRaw.value = name;
    lastConfirmedValue = name;
    hideNote();
    closeList();
    if (fromClick) input.focus();
  }

  function attemptFuzzyMatch() {
    var typed = input.value.trim();

    if (!typed) {
      hiddenValue.value = "";
      if (hiddenRaw) hiddenRaw.value = "";
      hideNote();
      return;
    }

    // Already an exact category name (selected from the list, or typed verbatim).
    var exact = data.flat.filter(function (c) { return c.name.toLowerCase() === typed.toLowerCase(); })[0];
    if (exact) {
      selectCategory(exact.name, false);
      return;
    }

    if (hiddenRaw) hiddenRaw.value = typed;

    var result = data.match(typed);
    if (result && result.confident) {
      hiddenValue.value = result.category;
      input.value = result.category;
      showNote(
        "Matched “" + typed + "” to “" + result.category + "”. Not right? Just start typing again to change it.",
        "matched"
      );
    } else if (result) {
      hiddenValue.value = typed;
      showNote(
        "We're not fully sure which category fits “" + typed + "” — closest guess is “" + result.category + "”. We've saved what you typed either way, and Brett will confirm it with you.",
        "uncertain"
      );
    } else {
      hiddenValue.value = typed;
      showNote(
        "Saved as typed: “" + typed + "”. Brett will follow up to confirm the category.",
        "uncertain"
      );
    }
  }

  input.addEventListener("input", function () {
    hideNote();
    var groups = data.filter(input.value, 40);
    renderGroups(groups);
    activeIndex = -1;
    openList();
  });

  input.addEventListener("focus", function () {
    var groups = data.filter(input.value, 40);
    renderGroups(groups);
    openList();
  });

  input.addEventListener("keydown", function (e) {
    if (listbox.hidden && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      openList();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentOptions.length - 1);
      highlightActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlightActive();
    } else if (e.key === "Enter") {
      if (!listbox.hidden && activeIndex >= 0 && currentOptions[activeIndex]) {
        e.preventDefault();
        selectCategory(currentOptions[activeIndex], false);
      } else {
        e.preventDefault();
        attemptFuzzyMatch();
        closeList();
      }
    } else if (e.key === "Escape") {
      closeList();
    }
  });

  input.addEventListener("blur", function () {
    // Slight delay so a mousedown-driven option click can register first.
    setTimeout(function () {
      if (listbox.hidden) return;
      attemptFuzzyMatch();
      closeList();
    }, 120);
  });
});
