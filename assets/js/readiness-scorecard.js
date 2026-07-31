/* ---------------------------------------------------------------------
 * DPP Readiness Scorecard - fully client-side, no email required.
 * Nothing here is sent anywhere unless the visitor opts into the
 * optional follow-up form at the end (handled generically by the
 * .notify-form logic in app.js).
 * ------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.getElementById("scorecardApp");
  if (!root) return;

  var OPTIONS_STANDARD = [
    { label: "Yes - fully in place", points: 3 },
    { label: "Partially, for some products", points: 2 },
    { label: "We're just getting started", points: 1 },
    { label: "No, not yet", points: 0 }
  ];

  var QUESTIONS = [
    {
      category: "Data & documentation",
      text: "Do you have documented material composition data for your products?",
      options: OPTIONS_STANDARD
    },
    {
      category: "Data & documentation",
      text: "Do you track carbon footprint or environmental impact data per product?",
      options: [
        { label: "Yes, calculated and verified", points: 3 },
        { label: "Yes, estimated internally", points: 2 },
        { label: "Planned but not started", points: 1 },
        { label: "No", points: 0 }
      ]
    },
    {
      category: "Data & documentation",
      text: "Do you have repair, disassembly or end-of-life instructions documented?",
      options: OPTIONS_STANDARD
    },
    {
      category: "Suppliers & supply chain",
      text: "Can your suppliers already provide the data fields a DPP would require?",
      options: [
        { label: "Yes, most can already", points: 3 },
        { label: "Some can, others need chasing", points: 2 },
        { label: "We haven't asked yet", points: 1 },
        { label: "No visibility into this", points: 0 }
      ]
    },
    {
      category: "Suppliers & supply chain",
      text: "Do you have a process for requesting or updating supplier data?",
      options: [
        { label: "Yes, a formal recurring process", points: 3 },
        { label: "Ad hoc, on request", points: 2 },
        { label: "Just started thinking about it", points: 1 },
        { label: "No", points: 0 }
      ]
    },
    {
      category: "Suppliers & supply chain",
      text: "How many tiers of your supply chain do you have visibility into?",
      options: [
        { label: "Tier 1 and beyond", points: 3 },
        { label: "Tier 1 only", points: 2 },
        { label: "Limited or partial", points: 1 },
        { label: "None", points: 0 }
      ]
    },
    {
      category: "Systems & technology",
      text: "Is your product data centralised in a single PIM or ERP system?",
      options: [
        { label: "Yes, single source of truth", points: 3 },
        { label: "Partially, spread across systems", points: 2 },
        { label: "Mostly spreadsheets", points: 1 },
        { label: "No central system", points: 0 }
      ]
    },
    {
      category: "Systems & technology",
      text: "Do you have a way to attach a data carrier (QR, NFC, RFID) to products?",
      options: [
        { label: "Yes, already in place", points: 3 },
        { label: "Piloting on some products", points: 2 },
        { label: "Evaluating options", points: 1 },
        { label: "No", points: 0 }
      ]
    },
    {
      category: "Systems & technology",
      text: "Could you register a product in the EU DPP Registry today?",
      options: [
        { label: "Yes", points: 3 },
        { label: "With some work", points: 2 },
        { label: "Not without significant setup", points: 1 },
        { label: "Not sure how", points: 0 }
      ]
    },
    {
      category: "Process & ownership",
      text: "Is there a named owner for DPP compliance in your organisation?",
      options: [
        { label: "Yes, a dedicated owner or team", points: 3 },
        { label: "Yes, informally", points: 2 },
        { label: "Being discussed", points: 1 },
        { label: "No", points: 0 }
      ]
    },
    {
      category: "Process & ownership",
      text: "Do you know which delegated act(s) apply to your product category, and when?",
      options: [
        { label: "Yes, tracking actively", points: 3 },
        { label: "Roughly", points: 2 },
        { label: "Not really", points: 1 },
        { label: "No", points: 0 }
      ]
    },
    {
      category: "Process & ownership",
      text: "Have you budgeted time or resources for DPP compliance work?",
      options: [
        { label: "Yes, dedicated budget", points: 3 },
        { label: "Some informal allocation", points: 2 },
        { label: "Not yet", points: 1 },
        { label: "No", points: 0 }
      ]
    }
  ];

  var CATEGORIES = ["Data & documentation", "Suppliers & supply chain", "Systems & technology", "Process & ownership"];

  var RECOMMENDATIONS = {
    "Data & documentation": 'Start documenting material composition, carbon footprint and end-of-life data for your top SKUs first - the <a href="data-organizer.html">DPP Data Organizer</a> gives you the full checklist for your category.',
    "Suppliers & supply chain": 'Send a structured data request to your key suppliers rather than one-off emails - see the <a href="supplier-templates.html">Supplier Data-Request Template Pack</a>.',
    "Systems & technology": 'Centralise product data in one system before attaching a data carrier - see <a href="../index.html#how-it-works">how a DPP actually works</a> end to end.',
    "Process & ownership": 'Assign a named DPP owner and check the <a href="../index.html#timeline">rollout timeline</a> for your specific product category.'
  };

  var answers = new Array(QUESTIONS.length).fill(null);
  var current = 0;

  var quizView = root.querySelector("[data-quiz-view]");
  var resultsView = root.querySelector("[data-results-view]");

  function renderQuestion() {
    var q = QUESTIONS[current];
    var pct = Math.round((current / QUESTIONS.length) * 100);

    quizView.innerHTML =
      '<div class="quiz-progress">' +
        '<div class="quiz-progress-bar"><i style="width:' + pct + '%"></i></div>' +
        '<span class="quiz-progress-label">Question ' + (current + 1) + ' of ' + QUESTIONS.length + '</span>' +
      '</div>' +
      '<div class="quiz-card">' +
        '<span class="quiz-category-tag">' + q.category + '</span>' +
        '<h3>' + q.text + '</h3>' +
        '<div class="quiz-options">' +
        q.options.map(function (opt, i) {
          var checked = answers[current] === i ? " checked" : "";
          var activeClass = answers[current] === i ? " is-checked" : "";
          return '<label class="quiz-option' + activeClass + '">' +
            '<input type="radio" name="q' + current + '" value="' + i + '"' + checked + '>' +
            '<span>' + opt.label + '</span></label>';
        }).join("") +
        '</div>' +
      '</div>' +
      '<div class="quiz-nav">' +
        '<button type="button" class="btn btn-ghost" data-back' + (current === 0 ? " disabled" : "") + '>← Back</button>' +
        '<button type="button" class="btn btn-primary" data-next disabled>' +
          (current === QUESTIONS.length - 1 ? "See my score" : "Next") +
        '</button>' +
      '</div>';

    quizView.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.addEventListener("change", function () {
        answers[current] = parseInt(input.value, 10);
        quizView.querySelectorAll(".quiz-option").forEach(function (l) { l.classList.remove("is-checked"); });
        input.closest(".quiz-option").classList.add("is-checked");
        quizView.querySelector("[data-next]").removeAttribute("disabled");
      });
    });

    var backBtn = quizView.querySelector("[data-back]");
    var nextBtn = quizView.querySelector("[data-next]");
    if (answers[current] !== null) { nextBtn.removeAttribute("disabled"); }

    backBtn.addEventListener("click", function () {
      if (current > 0) { current -= 1; renderQuestion(); }
    });
    nextBtn.addEventListener("click", function () {
      if (current < QUESTIONS.length - 1) {
        current += 1;
        renderQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    var totalPoints = 0;
    var maxPoints = 0;
    var byCategory = {};
    CATEGORIES.forEach(function (c) { byCategory[c] = { points: 0, max: 0 }; });

    QUESTIONS.forEach(function (q, i) {
      var maxQ = 3;
      var got = answers[i] === null ? 0 : q.options[answers[i]].points;
      totalPoints += got;
      maxPoints += maxQ;
      byCategory[q.category].points += got;
      byCategory[q.category].max += maxQ;
    });

    var overall = Math.round((totalPoints / maxPoints) * 100);
    var tag, sub;
    if (overall >= 80) { tag = "Ahead of the curve"; sub = "You're in good shape - most of the groundwork is already done."; }
    else if (overall >= 60) { tag = "On track"; sub = "Solid foundations, with clear gaps left to close before deadlines land."; }
    else if (overall >= 40) { tag = "Getting started"; sub = "The basics are underway, but there's meaningful work ahead."; }
    else { tag = "Early days"; sub = "Now is the moment to start - most delegated acts are still 1-3 years out."; }

    var sortedCats = CATEGORIES.slice().sort(function (a, b) {
      return (byCategory[a].points / byCategory[a].max) - (byCategory[b].points / byCategory[b].max);
    });

    var actionItems = sortedCats.slice(0, 3).map(function (c) {
      return '<li>' + RECOMMENDATIONS[c] + '</li>';
    }).join("");

    quizView.style.display = "none";
    resultsView.style.display = "block";
    resultsView.innerHTML =
      '<div class="quiz-results-hero">' +
        '<div class="quiz-score-ring" style="--pct:' + overall + '"><span><span class="num">' + overall + '</span><span class="lbl">/ 100</span></span></div>' +
        '<div><div class="quiz-score-tag">' + tag + '</div><p class="quiz-score-sub">' + sub + '</p></div>' +
      '</div>' +
      '<h2>Breakdown by category</h2>' +
      '<div class="quiz-breakdown">' +
      CATEGORIES.map(function (c) {
        var pct = Math.round((byCategory[c].points / byCategory[c].max) * 100);
        return '<div class="quiz-breakdown-row"><span class="lbl">' + c + '</span>' +
          '<span class="bar"><i style="width:' + pct + '%"></i></span>' +
          '<span class="val">' + pct + '%</span></div>';
      }).join("") +
      '</div>' +
      '<h2>Your action list</h2>' +
      '<ul class="quiz-actions-list">' + actionItems + '</ul>' +
      '<h2>Want a hand with any of this?</h2>' +
      '<form class="notify-form" data-tool="Readiness Scorecard follow-up" data-success="Thanks - we\'ve passed your results to the team, they\'ll follow up if useful.">' +
        '<div class="form-row">' +
          '<label for="nf-email-scorecard">Email <span class="opt">(optional)</span></label>' +
          '<input id="nf-email-scorecard" name="email" type="email" placeholder="jane@company.com">' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">Send my results to the team</button>' +
        '<p class="notify-note" aria-live="polite"></p>' +
      '</form>' +
      '<div class="tool-detail-cta">' +
        '<button type="button" class="btn btn-ghost" data-restart>Start over</button>' +
        '<a href="index.html" class="btn btn-ghost">Browse other tools</a>' +
      '</div>';

    resultsView.querySelector("[data-restart]").addEventListener("click", function () {
      answers = new Array(QUESTIONS.length).fill(null);
      current = 0;
      resultsView.style.display = "none";
      resultsView.innerHTML = "";
      quizView.style.display = "block";
      renderQuestion();
    });

    // the notify-form inside resultsView was just inserted after app.js's
    // generic listener setup ran, so it needs its own binding here
    var form = resultsView.querySelector(".notify-form");
    if (form && window.attachNotifyForm) { window.attachNotifyForm(form); }
  }

  renderQuestion();
})();
