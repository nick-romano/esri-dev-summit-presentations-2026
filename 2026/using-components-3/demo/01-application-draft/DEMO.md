# Live demo: build the Morel app (safe checkpoints)

This folder is designed for a live, low-risk demo.

## One-time setup (before the talk)

- In this folder:
  - `npm install`
  - `npm run dev`

## On stage workflow

- Start at a known step tag, then advance step-by-step.
- If anything breaks, jump directly to `final`.

### Commands

- Start Step-00:
  - `git checkout step-00`
- Jump to the next step:
  - `git checkout step-01`
  - …
- Escape hatch:
  - `git checkout final`

## Step script

Each step should take ~1–3 minutes: briefly explain, refresh browser, verify.

- Step-00: Calcite shell baseline
  - Verify: header renders.

- Step-01: Add `arcgis-map` (web map loads)
  - Verify: map renders and is interactive.

- Step-02: Map slots
  - Verify: `arcgis-zoom` appears in `bottom-right`.

- Step-03: Reusable UI (`MorelTile` / `MorelPanel`)
  - Verify: tiles render with placeholder values.

- Step-04: Map click → results + elevation sampling (`reference-element`)
  - Verify: clicking updates Location + Elevation tiles.

- Step-05: Layers panel + view-ready wiring
  - Verify: layer controls render and affect the map.

- Step-06: Responsive filters sheet
  - Verify: narrow screen shows a gear action that opens filters.

- Step-07: Feature inspection sheet (`reference-element`)
  - Verify: “Inspect features at location” opens a Calcite sheet with
    `arcgis-features`.

## Presenter notes

- Prefer tiny edits live; treat each step as a pre-built checkpoint.
- If the map item ever fails to load (network/auth), immediately
  `git checkout final` and continue the narrative.
