# City London Template Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make New York, Los Angeles, San Francisco Bay Area, and Tokyo dashboards follow the London dashboard display logic for the user-visible navigation sections.

**Architecture:** Keep each city as a single static HTML dashboard. Reuse each city's existing data arrays and copy London's section logic: ordered tabs, conclusion-first sections, product type trend cards, China buyer preference trend cards, cumulative ROI calculator, and monthly holding-cost calculator.

**Tech Stack:** Static HTML, CSS, Chart.js, Leaflet, vanilla JavaScript.

---

### Task 1: Normalize Navigation And Section Order

**Files:**
- Modify: `new-york-property-dashboard/index.html`
- Modify: `la-property-dashboard/index.html`
- Modify: `sf-bay-property-dashboard/index.html`
- Modify: `tokyo-property-dashboard/index.html`

- [x] Set tab order to match London: market, district, type, roi, china, policy, agency, exchange, cost, global, hot.
- [x] Change tab handlers to `showSection('<id>', event)`.
- [x] Replace `showSection` with an event-safe version.

### Task 2: Add London-Style Product Type Logic

**Files:** same four dashboard files.

- [x] Add product type volume trend card.
- [x] Add product type average price trend card.
- [x] Add product type detail table.
- [x] Use each city's existing monthly data arrays.

### Task 3: Add London-Style China Buyer Preference Logic

**Files:** same four dashboard files.

- [x] Add stacked preference trend chart.
- [x] Add radar chart for latest buyer preference mix.
- [x] Mark the module as institutional sample / B-grade where appropriate.

### Task 4: Align ROI And Holding Cost UI

**Files:** same four dashboard files.

- [x] Replace US-city ROI sections with London's cumulative ROI calculator pattern.
- [x] Keep Tokyo cumulative ROI pattern and fix duplicate `roiAppreciation` id.
- [x] Replace holding-cost sections with London-style inputs and result cards.

### Task 5: Verify

**Files:** same four dashboard files.

- [x] Run `node --check` against extracted scripts.
- [x] Run DOM id checks for required calculators and charts.
- [x] Run duplicate id checks.
- [x] Run `git diff --check`.
