/* ---------------------------------------------------------------------
 * DPP Tools & Software Directory - progressive enhancement only.
 * Every entry is real, static HTML (so it's fully readable without JS,
 * by search engines and AI answer engines alike); this file just adds
 * client-side category filtering and a search box on top of it.
 * ------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.getElementById("directoryApp");
  if (!root) return;

  var suggestionForm = document.querySelector('.notify-form[data-tool="Directory suggestion"]');
  if (suggestionForm) {
    suggestionForm.getExtraFields = function () {
      var textarea = suggestionForm.querySelector('[name="suggestion"]');
      return { "Suggestion": (textarea && textarea.value.trim()) || "(none provided)" };
    };
  }

  var searchInput = root.querySelector("#directorySearch");
  var chips = root.querySelectorAll("[data-dir-filter]");
  var entries = root.querySelectorAll(".directory-entry");
  var emptyState = root.querySelector("[data-empty-state]");
  var activeFilter = "all";

  function applyFilters() {
    var term = (searchInput && searchInput.value || "").trim().toLowerCase();
    var visibleCount = 0;

    entries.forEach(function (entry) {
      var cats = (entry.getAttribute("data-categories") || "").split(" ");
      var matchesFilter = activeFilter === "all" || cats.indexOf(activeFilter) !== -1;
      var matchesSearch = !term || entry.textContent.toLowerCase().indexOf(term) !== -1;
      var visible = matchesFilter && matchesSearch;
      entry.style.display = visible ? "" : "none";
      if (visible) { visibleCount += 1; }
    });

    if (emptyState) { emptyState.style.display = visibleCount === 0 ? "block" : "none"; }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      activeFilter = chip.getAttribute("data-dir-filter");
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
})();
