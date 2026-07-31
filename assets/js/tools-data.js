/* ---------------------------------------------------------------------
 * DPP Radar - Free Tools data (single source of truth)
 *
 * Drives: the homepage "Free tools" section, the /tools hub page, and
 * the footer/nav "Tools" link target. Add a new tool here and it shows
 * up everywhere automatically - don't hand-edit tool cards elsewhere.
 *
 * Fields:
 *   slug           - used to build the tool's page URL: tools/<slug>.html
 *   title          - card / page heading
 *   blurb          - one-line description (homepage + hub cards)
 *   getLine        - one-line "what you'll get" (hub cards + scaffold pages)
 *   status         - "live" | "soon"
 *   type           - "interactive" | "capture" (see UX rule below)
 *   icon           - emoji, matches the site's existing icon style
 *   externalAnchor - optional: if set, the card links here instead of
 *                    tools/<slug>.html (root-relative, e.g. "index.html#after-scan")
 *
 * UX rule: "interactive" tools must never gate their core value behind
 * an email address - only a "capture" tool (template packs, alerts) is
 * allowed to make email the whole point of the interaction.
 * ------------------------------------------------------------------- */

var DPP_TOOLS = [
  {
    slug: "readiness-scorecard",
    title: "DPP Readiness Scorecard",
    blurb: "Answer ~12 questions, get a 0-100 readiness score and a personalised report.",
    getLine: "You'll get: a 0-100 readiness score, a breakdown by category, and a personalised action list.",
    status: "live",
    type: "interactive",
    icon: "📊"
  },
  {
    slug: "data-organizer",
    title: "DPP Data Organizer",
    blurb: "For your category, get every required data field and tag each as 'in ERP', 'ask supplier', or 'missing'.",
    getLine: "You'll get: every required data field for your category, tagged and exportable to PDF/CSV.",
    status: "live",
    type: "interactive",
    icon: "🗂️"
  },
  {
    slug: "time-estimator",
    title: "Time-to-DPP Estimator",
    blurb: "Enter category, SKU count and supplier count to estimate months-to-ready by phase.",
    getLine: "You'll get: an estimated months-to-ready timeline, broken down by phase.",
    status: "soon",
    type: "interactive",
    icon: "⏱️"
  },
  {
    slug: "dpp-demo-generator",
    title: "DPP Demo Generator",
    blurb: "Enter your product details and get a shareable, verifiable passport page of your own.",
    getLine: "You'll get: a shareable, verifiable passport page built from your own product details.",
    status: "soon",
    type: "interactive",
    icon: "🧾"
  },
  {
    slug: "dpp-demo",
    title: "Interactive DPP Demo",
    blurb: "See a real Digital Product Passport: consumer vs authority views, live tamper check.",
    getLine: "You'll get: a live walkthrough of a real passport - consumer view, authority view, and a tamper check.",
    status: "live",
    type: "interactive",
    icon: "📱",
    externalAnchor: "index.html#after-scan"
  },
  {
    slug: "directory",
    title: "DPP Tools & Software Directory",
    blurb: "A filterable directory of DPP issuers, wallet providers, data carriers and open-source projects.",
    getLine: "You'll get: a filterable list of DPP issuers, wallet providers, data carriers and open-source projects.",
    status: "soon",
    type: "interactive",
    icon: "🧭"
  },
  {
    slug: "supplier-templates",
    title: "Supplier Data-Request Template Pack",
    blurb: "Ready-to-send email + spreadsheet templates for requesting DPP data from suppliers.",
    getLine: "You'll get: ready-to-send email and spreadsheet templates for requesting data from suppliers.",
    status: "soon",
    type: "capture",
    icon: "✉️"
  },
  {
    slug: "deadline-alerts",
    title: "Deadline Alerts",
    blurb: "Pick your category and get notified when its delegated act is published.",
    getLine: "You'll get: an email the moment your category's delegated act is published.",
    status: "soon",
    type: "capture",
    icon: "🔔"
  },
  {
    slug: "qr-quiz",
    title: "‘Is a QR code enough?’ Quiz",
    blurb: "A short quiz that scores how DPP-ready your QR-code thinking really is.",
    getLine: "You'll get: a score on how DPP-ready your QR-code thinking really is, with quick fixes.",
    status: "soon",
    type: "interactive",
    icon: "🔳"
  }
];
