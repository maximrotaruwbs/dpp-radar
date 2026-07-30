(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * Mobile nav
   * ------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll reveal
   * ------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------------
   * Timeline - data reflects the ESPR / DPP rollout (dates are UTC, EU)
   * Status is computed live against the visitor's clock, so the page
   * keeps telling the right "today / next" story as time passes.
   * ------------------------------------------------------------------- */
  var TODAY = new Date();

  var timelineEvents = [
    {
      date: new Date("2024-07-18"),
      title: "ESPR enters into force",
      tag: "Framework",
      detail: "The Ecodesign for Sustainable Products Regulation (EU) 2024/1781 enters into force, replacing the old Ecodesign Directive and creating the legal basis for the Digital Product Passport."
    },
    {
      date: new Date("2026-07-19"),
      title: "ESPR reaches full application",
      tag: "Framework",
      detail: "The regulation becomes fully applicable across the EU, activating the general obligations that later delegated acts build on category by category."
    },
    {
      date: new Date("2026-07-20"),
      title: "EU DPP Registry goes live",
      tag: "Infrastructure",
      detail: "The Commission launches the central DPP Registry plus a public testing environment, so economic operators can register products via a secure UI or an API."
    },
    {
      date: new Date("2026-12-31"),
      title: "Iron & Steel delegated act (indicative)",
      tag: "Delegated act",
      detail: "Iron and steel - an intermediate product feeding many finished goods - is first in line for a delegated act, expected before the end of 2026."
    },
    {
      date: new Date("2027-02-18"),
      title: "Battery passport becomes mandatory",
      tag: "Enforcement",
      detail: "EV, industrial and LMT batteries above 2kWh must carry a QR-linked digital battery passport under the Battery Regulation - the first DPP obligation to actually bite."
    },
    {
      date: new Date("2027-12-31"),
      title: "Textiles, tyres & aluminium delegated acts (indicative)",
      tag: "Delegated act",
      detail: "Apparel & footwear, tyres, and aluminium are expected to get their delegated acts adopted, starting an 18-month countdown to enforcement for each."
    },
    {
      date: new Date("2028-12-31"),
      title: "Furniture delegated act + ESPR mid-term review",
      tag: "Delegated act",
      detail: "Furniture joins the scope, and the Commission runs a scheduled mid-term review that can reshuffle priorities or add new product groups."
    },
    {
      date: new Date("2029-12-31"),
      title: "Mattresses delegated act (indicative)",
      tag: "Delegated act",
      detail: "Mattresses close out the six product groups named in the first ESPR Working Plan."
    },
    {
      date: new Date("2030-12-31"),
      title: "Full framework across covered categories",
      tag: "Framework",
      detail: "By this horizon the ESPR transition regime concludes for the categories already in scope, with further rounds expected to keep expanding coverage."
    }
  ];

  function classify(events, today) {
    var past = [], future = [];
    events.forEach(function (e) {
      (e.date < today ? past : future).push(e);
    });
    future.sort(function (a, b) { return a.date - b.date; });
    var nextEvent = future[0];
    return events.map(function (e) {
      var status = e.date < today ? "done" : (e === nextEvent ? "next" : "later");
      return Object.assign({}, e, { status: status });
    });
  }

  function fmtDate(d) {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  var timelineData = classify(timelineEvents, TODAY);

  var track = document.getElementById("timelineTrack");
  var detailBox = document.getElementById("timelineDetail");

  if (track && detailBox) {
  function renderTimeline(filter) {
    track.innerHTML = "";

    // build combined list including a synthetic "today" marker in date order
    var combined = timelineData.map(function (e) { return { kind: "event", data: e }; });
    combined.push({ kind: "today", date: TODAY });
    combined.sort(function (a, b) {
      var da = a.kind === "today" ? a.date : a.data.date;
      var db = b.kind === "today" ? b.date : b.data.date;
      return da - db;
    });

    combined.forEach(function (item, idx) {
      if (item.kind === "today") {
        var flag = document.createElement("div");
        flag.className = "tl-node status-today";
        flag.style.width = "150px";
        flag.style.flex = "0 0 150px";
        flag.innerHTML =
          '<span class="tl-today-flag">TODAY · ' + fmtDate(TODAY) + '</span>' +
          '<span class="tl-dot"></span>' +
          '<div class="tl-card"><h4>You are here</h4><span class="tl-tag">Live status</span></div>';
        track.appendChild(flag);
        return;
      }

      var e = item.data;
      if (filter !== "all" && e.status !== filter) return;

      var node = document.createElement("div");
      node.className = "tl-node status-" + e.status;
      node.setAttribute("role", "listitem");
      node.setAttribute("tabindex", "0");
      node.innerHTML =
        '<span class="tl-date">' + fmtDate(e.date) + '</span>' +
        '<span class="tl-dot"></span>' +
        '<div class="tl-card"><h4>' + e.title + '</h4><span class="tl-tag">' + e.tag + '</span></div>';

      function activate() {
        track.querySelectorAll(".tl-node").forEach(function (n) { n.classList.remove("is-active"); });
        node.classList.add("is-active");
        var statusLabel = e.status === "done" ? "Already in force" : (e.status === "next" ? "Coming up next" : "Further out");
        detailBox.className = "timeline-detail is-" + e.status;
        detailBox.innerHTML =
          '<b>' + fmtDate(e.date) + ' - ' + e.title + '</b> · ' + statusLabel + '<br>' + e.detail;
      }

      node.addEventListener("click", activate);
      node.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activate(); }
      });

      track.appendChild(node);
    });
  }

  renderTimeline("all");
  var nextEl = timelineData.find(function (e) { return e.status === "next"; });
  if (nextEl) {
    detailBox.className = "timeline-detail is-next";
    detailBox.innerHTML = '<b>' + fmtDate(nextEl.date) + ' - ' + nextEl.title + '</b> · Coming up next<br>' + nextEl.detail;
  }

  document.querySelectorAll("[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-filter]").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      renderTimeline(btn.getAttribute("data-filter"));
    });
  });
  } // end timeline guard

  /* ---------------------------------------------------------------------
   * Categories
   * ------------------------------------------------------------------- */
  var categories = [
    { icon: "🔋", name: "Batteries", slug: "batteries", status: "force", statusLabel: "Regulation in force",
      desc: "EV, industrial and LMT batteries above 2kWh need a QR-linked battery passport under the Battery Regulation.",
      date: "Mandatory from 18 Feb 2027" },
    { icon: "🔩", name: "Iron & Steel", slug: "iron-steel", status: "pending", statusLabel: "Delegated act expected",
      desc: "An intermediate product prioritised first, since finished-goods passports downstream depend on its data.",
      date: "Delegated act expected 2026" },
    { icon: "👕", name: "Textiles & Apparel", slug: "textiles-apparel", status: "pending", statusLabel: "Delegated act expected",
      desc: "Clothing and footwear, one of the six product groups named in the first ESPR Working Plan.",
      date: "Delegated act expected 2027" },
    { icon: "🛞", name: "Tyres", slug: "tyres", status: "pending", statusLabel: "Delegated act expected",
      desc: "Passenger and commercial vehicle tyres, covering durability, abrasion and material content.",
      date: "Delegated act expected 2027" },
    { icon: "⛓️", name: "Aluminium", slug: "aluminium", status: "pending", statusLabel: "Delegated act expected",
      desc: "Second intermediate product in scope, feeding data into finished-goods passports.",
      date: "Delegated act expected 2027" },
    { icon: "🛋️", name: "Furniture", slug: "furniture", status: "pending", statusLabel: "Delegated act expected",
      desc: "Domestic and office furniture, part of the first ESPR Working Plan.",
      date: "Delegated act expected 2028" },
    { icon: "🛏️", name: "Mattresses", slug: "mattresses", status: "proposed", statusLabel: "Working plan / proposed",
      desc: "Closes out the six product groups named in the first ESPR Working Plan, furthest out on the timeline.",
      date: "Delegated act expected 2029" },
    { icon: "💻", name: "Electronics & ICT", slug: "electronics-ict", status: "proposed", statusLabel: "Working plan / proposed",
      desc: "Flagged for a future working-plan round, alongside recycled-content rules for electricals.",
      date: "Beyond the current Working Plan" }
  ];

  var statusClass = { force: "force", pending: "pending", proposed: "proposed" };
  var catGrid = document.getElementById("categoryGrid");

  if (catGrid) {
  function renderCategories(filter) {
    catGrid.innerHTML = "";
    categories.forEach(function (c) {
      if (filter !== "all" && c.statusLabel !== filter) return;
      var card = document.createElement("a");
      card.className = "card cat-card";
      card.href = "categories/" + c.slug + ".html";
      card.innerHTML =
        '<div class="cat-top"><span class="cat-icon">' + c.icon + '</span>' +
        '<span class="status-pill ' + statusClass[c.status] + '">' + c.statusLabel + '</span></div>' +
        '<h3>' + c.name + '</h3><p>' + c.desc + '</p>' +
        '<span class="cat-date">' + c.date + '</span>' +
        '<span class="cat-arrow">View category page →</span>';
      catGrid.appendChild(card);
    });
  }

  renderCategories("all");

  document.querySelectorAll("[data-cat-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-cat-filter]").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      renderCategories(btn.getAttribute("data-cat-filter"));
    });
  });
  } // end categories guard

  /* ---------------------------------------------------------------------
   * "After the scan" phone mock-up
   * ------------------------------------------------------------------- */
  var products = {
    jacket: {
      thumb: "🧥",
      name: "All-Weather Shell Jacket",
      sub: "GTIN 04012345678905 · SKU J-2031",
      score: 82,
      scoreLabel: "Environmental performance",
      bars: [
        { label: "Recycled polyester", pct: 62 },
        { label: "Virgin nylon", pct: 23 },
        { label: "Elastane", pct: 8 },
        { label: "Trims / other", pct: 7 }
      ],
      barTitle: "Material composition",
      facts: [
        { label: "Carbon footprint", value: "4.8 kg CO₂e / unit" },
        { label: "Repairability", value: "7.5 / 10" }
      ],
      tags: ["Repair guide available", "Take-back program", "OEKO-TEX certified"],
      note: "End of life: return to any partner store for recycling or resale."
    },
    battery: {
      thumb: "🔋",
      name: "EV Traction Battery 58kWh",
      sub: "NMC811 chemistry · Serial BX-58-002931",
      score: 74,
      scoreLabel: "Environmental performance",
      bars: [
        { label: "Steel / Al housing", pct: 40 },
        { label: "Nickel", pct: 34 },
        { label: "Cobalt", pct: 9 },
        { label: "Lithium", pct: 7 }
      ],
      barTitle: "Material composition",
      facts: [
        { label: "Carbon footprint", value: "61 kg CO₂e / kWh" },
        { label: "State of health", value: "96% at delivery" }
      ],
      tags: ["Second-life eligible", "Recycler network mapped", "Battery Reg. Art. 77"],
      note: "End of life: mandatory collection via the producer take-back network."
    }
  };

  var phoneScreen = document.getElementById("phoneScreen");
  var phoneCallouts = document.getElementById("phoneCallouts");

  if (phoneScreen && phoneCallouts) {
  var calloutCopy = [
    "The scan resolves to a unique product ID looked up in the EU DPP Registry - not a generic marketing page.",
    "Data is grouped by what the viewer needs: identity, materials, footprint, then care & end-of-life.",
    "Access can be tiered - a shopper sees a summary, while a recycler or auditor can unlock deeper technical data."
  ];

  function renderProduct(key) {
    var p = products[key];
    phoneScreen.innerHTML =
      '<div class="pd-hero"><div class="pd-thumb">' + p.thumb + '</div>' +
      '<div class="pd-name">' + p.name + '</div>' +
      '<div class="pd-sub">' + p.sub + '</div></div>' +
      '<div class="pd-score"><div class="ring" style="--pct:' + p.score + '"><span>' + p.score + '</span></div>' +
      '<div class="pd-score-label"><b>' + p.scoreLabel + '</b>Scored against category peers</div></div>' +
      '<div class="pd-block"><h5>' + p.barTitle + '</h5>' +
      p.bars.map(function (b) {
        return '<div class="pd-bar-row"><span class="lbl">' + b.label + '</span>' +
          '<span class="pd-bar"><i style="width:' + b.pct + '%"></i></span>' +
          '<span class="val">' + b.pct + '%</span></div>';
      }).join("") + '</div>' +
      '<div class="pd-block"><h5>Key facts</h5>' +
      p.facts.map(function (f) {
        return '<div class="pd-bar-row"><span class="lbl">' + f.label + '</span>' +
          '<span class="val" style="flex:1;text-align:left;color:var(--text)">' + f.value + '</span></div>';
      }).join("") + '</div>' +
      '<div class="pd-block"><h5>Certifications</h5><div class="pd-tags">' +
      p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join("") + '</div></div>' +
      '<div class="pd-note">' + p.note + '</div>';

    phoneCallouts.innerHTML = calloutCopy.map(function (c, i) {
      return '<div class="callout"><span class="num">' + (i + 1) + '</span><p>' + c + '</p></div>';
    }).join("");
  }

  renderProduct("jacket");

  document.querySelectorAll("[data-product]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-product]").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      renderProduct(btn.getAttribute("data-product"));
    });
  });
  } // end phone-mock guard

  /* ---------------------------------------------------------------------
   * Contact form -> real email delivery (fully static, no backend of our
   * own: submissions are relayed by FormSubmit, https://formsubmit.co).
   * The first submission ever sent to a given address requires a one-time
   * "activate this form" click from that inbox; every submission after
   * that is delivered silently.
   * ------------------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  var CONTACT_EMAIL = "maxim.rotaru@webamboos.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var company = form.company.value.trim();
      var message = form.message.value.trim();

      formNote.classList.remove("is-error", "is-success");

      if (!name || !email || !message) {
        formNote.textContent = "Please fill in your name, email and question.";
        formNote.classList.add("is-error");
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      formNote.textContent = "Sending…";

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          company: company || "(not provided)",
          message: message,
          _subject: "DPP Radar enquiry from " + name,
          _template: "table",
          _captcha: "false"
        })
      })
        .then(function (res) {
          if (!res.ok) { throw new Error("Request failed"); }
          return res.json();
        })
        .then(function () {
          formNote.textContent = "Thanks - your message has been sent. We'll get back to you soon.";
          formNote.classList.add("is-success");
          form.reset();
        })
        .catch(function () {
          formNote.textContent = "Something went wrong sending your message - please email us directly at " + CONTACT_EMAIL + ".";
          formNote.classList.add("is-error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
