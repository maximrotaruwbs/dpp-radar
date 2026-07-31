/* ---------------------------------------------------------------------
 * DPP Data Organizer - fully client-side. Your tags are saved only in
 * this browser (localStorage) - nothing is sent anywhere unless you
 * use the optional "send to my team" form or the CSV/print export,
 * both of which you trigger yourself.
 *
 * Field lists mirror the "what a passport is expected to cover"
 * checklists on each categories/<slug>.html page - keep them in sync.
 * ------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.getElementById("organizerApp");
  if (!root) return;

  var CATEGORY_FIELDS = {
    batteries: {
      label: "Batteries",
      fields: [
        "Manufacturer & battery model identity + unique product identifier",
        "Carbon footprint declaration & performance class",
        "Material composition (recycled content: cobalt, lithium, nickel, lead)",
        "Performance & durability data (rated capacity, expected lifetime, state of health)",
        "Safety information & supply-chain due-diligence disclosures",
        "Collection, take-back & recycling instructions"
      ]
    },
    "iron-steel": {
      label: "Iron & Steel",
      fields: [
        "Recycled-content share & production route (primary vs. secondary)",
        "Embodied carbon per tonne of material produced",
        "Presence of substances of concern",
        "Traceability of origin through the supply chain",
        "Durability & corrosion-resistance data where relevant"
      ]
    },
    "textiles-apparel": {
      label: "Textiles & Apparel",
      fields: [
        "Fibre composition & percentage of recycled content",
        "Durability data (wash-cycle resistance, colourfastness, seam strength)",
        "Reparability: spare-part availability & repair instructions",
        "Microplastic-shedding information",
        "Chemical & substance-of-concern disclosure",
        "Care instructions & take-back/resale routes at end of life"
      ]
    },
    tyres: {
      label: "Tyres",
      fields: [
        "Abrasion rate & tyre-wear particle emissions",
        "Rolling resistance & its effect on fuel/energy efficiency",
        "Wet-grip & safety performance ratings",
        "Material composition (natural vs. synthetic rubber, recycled content)",
        "Expected mileage & durability rating",
        "Retreading & end-of-life recycling information"
      ]
    },
    aluminium: {
      label: "Aluminium",
      fields: [
        "Recycled-content share & production route (primary vs. secondary smelting)",
        "Embodied carbon per tonne of material produced",
        "Alloy composition",
        "Presence of substances of concern",
        "Traceability of origin through the supply chain"
      ]
    },
    furniture: {
      label: "Furniture",
      fields: [
        "Material composition (wood, textile, metal, foam origin)",
        "Durability & structural-testing standards met",
        "Reparability: spare-part availability & disassembly instructions",
        "Recycled-content share",
        "Presence of substances of concern",
        "Take-back & recycling routes at end of life"
      ]
    },
    mattresses: {
      label: "Mattresses",
      fields: [
        "Material composition (foam type, spring construction, textile cover)",
        "Durability data",
        "Substances of concern, including flame retardants",
        "Recyclability & disassembly instructions for material recovery",
        "Availability of take-back schemes"
      ]
    },
    "electronics-ict": {
      label: "Electronics & ICT",
      fields: [
        "Material composition & critical raw materials used",
        "Reparability: spare-part availability & software-support duration",
        "Energy efficiency",
        "Recycled-content share",
        "Substances of concern, aligned with RoHS restrictions",
        "Take-back & WEEE compliance information"
      ]
    }
  };

  var TAG_LABELS = { "in-erp": "In ERP", "ask-supplier": "Ask supplier", "missing": "Missing" };
  var STORAGE_PREFIX = "dppOrganizer:";

  var select = root.querySelector("#organizerCategory");
  var summaryEl = root.querySelector("[data-summary]");
  var progressEl = root.querySelector("[data-progress]");
  var fieldsEl = root.querySelector("[data-fields]");
  var exportRow = root.querySelector("[data-export-row]");

  var currentSlug = null;
  var currentTags = {};

  function loadTags(slug) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + slug);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveTags(slug, tags) {
    try {
      localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(tags));
    } catch (e) { /* ignore (private browsing / storage full) */ }
  }

  function render(slug) {
    currentSlug = slug;
    currentTags = loadTags(slug);
    var cat = CATEGORY_FIELDS[slug];

    var counts = { "in-erp": 0, "ask-supplier": 0, missing: 0, untagged: 0 };
    cat.fields.forEach(function (f) {
      var t = currentTags[f];
      if (t && counts.hasOwnProperty(t)) { counts[t] += 1; } else { counts.untagged += 1; }
    });
    var total = cat.fields.length;
    var pct = Math.round((counts["in-erp"] / total) * 100);

    summaryEl.innerHTML =
      '<div class="organizer-stat in-erp"><span class="num">' + counts["in-erp"] + '</span><span class="lbl">In ERP</span></div>' +
      '<div class="organizer-stat ask-supplier"><span class="num">' + counts["ask-supplier"] + '</span><span class="lbl">Ask supplier</span></div>' +
      '<div class="organizer-stat missing"><span class="num">' + counts.missing + '</span><span class="lbl">Missing</span></div>' +
      '<div class="organizer-stat"><span class="num">' + total + '</span><span class="lbl">Total fields</span></div>';

    progressEl.innerHTML = '<i style="width:' + pct + '%"></i>';

    fieldsEl.innerHTML = cat.fields.map(function (f, i) {
      var tag = currentTags[f] || "";
      return '<div class="organizer-field-row">' +
        '<span class="organizer-field-name">' + f + '</span>' +
        '<div class="organizer-tag-group" data-field-index="' + i + '">' +
        ["in-erp", "ask-supplier", "missing"].map(function (t) {
          return '<button type="button" class="organizer-tag-btn' + (tag === t ? " is-active" : "") + '" data-tag="' + t + '">' + TAG_LABELS[t] + '</button>';
        }).join("") +
        '</div></div>';
    }).join("");

    fieldsEl.querySelectorAll(".organizer-tag-group").forEach(function (group) {
      var idx = parseInt(group.getAttribute("data-field-index"), 10);
      var fieldName = cat.fields[idx];
      group.querySelectorAll(".organizer-tag-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var tag = btn.getAttribute("data-tag");
          if (currentTags[fieldName] === tag) {
            delete currentTags[fieldName];
          } else {
            currentTags[fieldName] = tag;
          }
          saveTags(slug, currentTags);
          render(slug);
        });
      });
    });

    exportRow.style.display = "flex";
  }

  select.addEventListener("change", function () {
    if (select.value) { render(select.value); } else { fieldsEl.innerHTML = ""; summaryEl.innerHTML = ""; progressEl.innerHTML = ""; exportRow.style.display = "none"; }
  });

  // CSV export - pure client-side Blob download, no email, no server.
  root.querySelector("[data-export-csv]").addEventListener("click", function () {
    if (!currentSlug) return;
    var cat = CATEGORY_FIELDS[currentSlug];
    var rows = [["Category", "Field", "Status"]];
    cat.fields.forEach(function (f) {
      rows.push([cat.label, f, TAG_LABELS[currentTags[f]] || "Untagged"]);
    });
    var csv = rows.map(function (r) {
      return r.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "dpp-data-checklist-" + currentSlug + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // "Export to PDF" - the honest no-dependency version: the browser's own
  // print dialog, with a print stylesheet that hides everything but the
  // checklist so "Save as PDF" produces a clean document.
  root.querySelector("[data-export-print]").addEventListener("click", function () {
    window.print();
  });

  render(select.value);
})();
