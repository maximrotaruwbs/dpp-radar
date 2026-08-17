/* ---------------------------------------------------------------------
 * DPP Demo Generator - fully client-side. Product details you enter are
 * only ever encoded into the page's own URL (the "share link") - nothing
 * is sent to or stored on a server. This is a demo/mock-up for
 * illustration only, not a real registered Digital Product Passport.
 * ------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.getElementById("demoGenApp");
  if (!root) return;

  var CATEGORIES = [
    { slug: "batteries", label: "Batteries", icon: "🔋" },
    { slug: "iron-steel", label: "Iron & Steel", icon: "🔩" },
    { slug: "textiles-apparel", label: "Textiles & Apparel", icon: "👕" },
    { slug: "tyres", label: "Tyres", icon: "🛞" },
    { slug: "aluminium", label: "Aluminium", icon: "⛓️" },
    { slug: "furniture", label: "Furniture", icon: "🛋️" },
    { slug: "mattresses", label: "Mattresses", icon: "🛏️" },
    { slug: "electronics-ict", label: "Electronics & ICT", icon: "💻" }
  ];

  var form = root.querySelector("#demoGenForm");
  var materialsList = root.querySelector("[data-materials-list]");
  var previewScreen = root.querySelector("#demoGenScreen");
  var shareNote = root.querySelector("[data-share-note]");

  function defaultState() {
    return {
      productName: "",
      brand: "",
      sku: "",
      category: "textiles-apparel",
      score: "",
      materials: [{ name: "", pct: "" }],
      carbon: "",
      repairability: "",
      certifications: "",
      eol: ""
    };
  }

  function escapeAttr(v) { return String(v == null ? "" : v).replace(/"/g, "&quot;"); }
  function escapeHtml(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function readStateFromURL() {
    var params = new URLSearchParams(window.location.search);
    var raw = params.get("d");
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (e) { /* malformed link - fall back to defaults */ }
    return null;
  }

  function renderMaterialRows(materials) {
    materialsList.innerHTML = materials.map(function (m, i) {
      return '<div class="demogen-material-row" data-material-index="' + i + '">' +
        '<input type="text" data-material-name placeholder="Material (e.g. Recycled polyester)" value="' + escapeAttr(m.name) + '">' +
        '<input type="number" min="0" max="100" data-material-pct placeholder="%" value="' + escapeAttr(m.pct) + '">' +
        (materials.length > 1 ? '<button type="button" class="demogen-remove-material" data-remove-material aria-label="Remove material">×</button>' : '') +
        '</div>';
    }).join("");
  }

  function collectState() {
    var materials = Array.prototype.map.call(materialsList.querySelectorAll(".demogen-material-row"), function (row) {
      return {
        name: row.querySelector("[data-material-name]").value.trim(),
        pct: row.querySelector("[data-material-pct]").value.trim()
      };
    });
    if (!materials.length) { materials = [{ name: "", pct: "" }]; }

    return {
      productName: form.productName.value.trim(),
      brand: form.brand.value.trim(),
      sku: form.sku.value.trim(),
      category: form.category.value,
      score: form.score.value.trim(),
      materials: materials,
      carbon: form.carbon.value.trim(),
      repairability: form.repairability.value.trim(),
      certifications: form.certifications.value.trim(),
      eol: form.eol.value.trim()
    };
  }

  function applyStateToForm(state) {
    form.productName.value = state.productName || "";
    form.brand.value = state.brand || "";
    form.sku.value = state.sku || "";
    form.category.value = state.category || "textiles-apparel";
    form.score.value = state.score || "";
    form.carbon.value = state.carbon || "";
    form.repairability.value = state.repairability || "";
    form.certifications.value = state.certifications || "";
    form.eol.value = state.eol || "";
    renderMaterialRows(state.materials && state.materials.length ? state.materials : [{ name: "", pct: "" }]);
  }

  function renderPreview() {
    var state = collectState();
    var cat = CATEGORIES.filter(function (c) { return c.slug === state.category; })[0] || CATEGORIES[2];

    var subParts = [];
    if (state.brand) { subParts.push(state.brand); }
    if (state.sku) { subParts.push("SKU " + state.sku); }
    var sub = subParts.length ? subParts.join(" · ") : cat.label;

    var scoreHtml = "";
    var scoreNum = parseInt(state.score, 10);
    if (!isNaN(scoreNum)) {
      scoreNum = Math.max(0, Math.min(100, scoreNum));
      scoreHtml = '<div class="pd-score"><div class="ring" style="--pct:' + scoreNum + '"><span>' + scoreNum + '</span></div>' +
        '<div class="pd-score-label"><b>Environmental performance</b>Scored against category peers</div></div>';
    }

    var materials = state.materials.filter(function (m) { return m.name; });
    var materialsHtml = "";
    if (materials.length) {
      materialsHtml = '<div class="pd-block"><h5>Material composition</h5>' +
        materials.map(function (m) {
          var pct = Math.max(0, Math.min(100, parseInt(m.pct, 10) || 0));
          return '<div class="pd-bar-row"><span class="lbl">' + escapeHtml(m.name) + '</span>' +
            '<span class="pd-bar"><i style="width:' + pct + '%"></i></span>' +
            '<span class="val">' + (m.pct ? pct + "%" : "-") + '</span></div>';
        }).join("") + '</div>';
    }

    var keyFactsRows = "";
    if (state.carbon) {
      keyFactsRows += '<div class="pd-bar-row"><span class="lbl">Carbon footprint</span>' +
        '<span class="val" style="flex:1;text-align:left;color:var(--text)">' + escapeHtml(state.carbon) + '</span></div>';
    }
    if (state.repairability) {
      keyFactsRows += '<div class="pd-bar-row"><span class="lbl">Repairability</span>' +
        '<span class="val" style="flex:1;text-align:left;color:var(--text)">' + escapeHtml(state.repairability) + '</span></div>';
    }
    var keyFactsHtml = keyFactsRows ? '<div class="pd-block"><h5>Key facts</h5>' + keyFactsRows + '</div>' : "";

    var certTags = state.certifications.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    var certHtml = certTags.length ? '<div class="pd-block"><h5>Certifications</h5><div class="pd-tags">' +
      certTags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join("") + '</div></div>' : "";

    var noteHtml = state.eol ? '<div class="pd-note">' + escapeHtml(state.eol) + '</div>' : "";

    previewScreen.innerHTML =
      '<div class="pd-hero">' +
        '<div class="pd-thumb">' + cat.icon + '</div>' +
        '<div class="pd-name">' + (state.productName ? escapeHtml(state.productName) : "Your product name") + '</div>' +
        '<div class="pd-sub">' + escapeHtml(sub) + '</div>' +
      '</div>' +
      scoreHtml + materialsHtml + keyFactsHtml + certHtml + noteHtml;
  }

  function shareUrl(state) {
    return window.location.origin + window.location.pathname + "?d=" + encodeURIComponent(JSON.stringify(state));
  }

  form.addEventListener("input", renderPreview);
  materialsList.addEventListener("input", renderPreview);

  root.querySelector("[data-add-material]").addEventListener("click", function () {
    var state = collectState();
    state.materials.push({ name: "", pct: "" });
    renderMaterialRows(state.materials);
    renderPreview();
  });

  materialsList.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-remove-material]");
    if (!btn) { return; }
    var state = collectState();
    var idx = parseInt(btn.closest(".demogen-material-row").getAttribute("data-material-index"), 10);
    state.materials.splice(idx, 1);
    if (!state.materials.length) { state.materials.push({ name: "", pct: "" }); }
    renderMaterialRows(state.materials);
    renderPreview();
  });

  root.querySelector("[data-copy-link]").addEventListener("click", function () {
    var url = shareUrl(collectState());
    history.replaceState(null, "", url);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        shareNote.textContent = "Link copied - paste it anywhere to share this exact preview.";
        shareNote.classList.add("is-success");
      }, function () {
        shareNote.textContent = url;
        shareNote.classList.remove("is-success");
      });
    } else {
      shareNote.textContent = url;
      shareNote.classList.remove("is-success");
    }
  });

  root.querySelector("[data-reset]").addEventListener("click", function () {
    applyStateToForm(defaultState());
    renderPreview();
    history.replaceState(null, "", window.location.pathname);
    shareNote.textContent = "";
    shareNote.classList.remove("is-success");
  });

  root.querySelector("[data-export-print]").addEventListener("click", function () {
    window.print();
  });

  applyStateToForm(readStateFromURL() || defaultState());
  renderPreview();
})();
