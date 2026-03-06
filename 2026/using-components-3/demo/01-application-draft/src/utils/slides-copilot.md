---
titleTemplate: '%s'
author: Adam Tirella, Nicholas Romano, Kitty Hurley
mdc: true
colorSchema: light
---

## ArcGIS Maps SDK for JavaScript:<br>App Development with Components,<br>Part 3: User Experience

Adam Tirella, Nicholas Romano, Kitty Hurley

---

## is: feedback

# What you'll get from this session

- A simple mental model for building UI with web components
- A practical layout pattern using Calcite (shell + panels)
- How ArcGIS map components fit into that layout (and how slots help)
- Demo of building a map-centered app with these ideas

---

# Who this is for

- Newer to web development and UI architecture
- Comfortable with JavaScript/TypeScript basics
- Using React (but the ideas apply to other frameworks)

Advanced folks: we’ll sprinkle in tips on composition, typing, and
maintainability.

---

# Previous session (yesterday)

App Development with Components Part 2: Using Frameworks

> The session touches on current front-end methodologies for topics such as
> dependency management, asset management, semantic versioning, prebuilt versus
> built applications that scale, and conveniences offered by frameworks that
> streamline web mapping app development compared to plain JavaScript.

If you missed the previous session, we have a recording. These 4-part sessions
build on top of each other.

---

# Today's session

3rd in a 4-part series

- We will cover:
  - Calcite Design System: composing a layout
  - ArcGIS map components: using slots in the map component
  - ArcGIS map components: `reference-element` (layout + positioning)
  - React + Calcite: building small composable UI elements

---

# The demo we’ll build through

Shell app with a map-centered experience:

- Map on the right
- Panels on the left for layers + “Morel probability” results
- Click/tap the map → compute a few values → render result tiles

Goal: show how components help you scale UX without a huge framework.

---

# UX goals (novice-friendly checklist)

- Clear layout: map is primary, controls are secondary
- Fast feedback: show “Tap map” / placeholder states
- Progressive disclosure: tiles summarize, descriptions add context
- Consistent visual language: icons + meters + headings

---

# Three component families we’re combining

- Calcite components: layout + patterns (panels, tiles, meters)
- ArcGIS map components: map + widgets as components
- Your app components: composition + state + domain logic

The win is not any single component — it’s how they fit together.

---

# Web components in one slide

Think of them like “custom HTML tags” with:

- properties/attributes
- events
- slots (places you can inject content)

They work with vanilla JS, React, Vue, etc.

---

# Calcite layout pattern: shell + panels

- Use Calcite to establish structure and hierarchy
- Keep the map as the main content area
- Use panels for navigation, layers, and results

In the demo, the “Morel” panel is a small, reusable piece of UI.

---

# Map-first layout: keep it predictable

- Panels stay stable
- Map interaction drives UI updates
- UI never blocks the map unnecessarily

This pattern is great for novice users (and still powerful for experts).

---

# Live demo checkpoint 1

Create the shell:

- App layout
- Map component in main area
- Left panels for layers + results

---

# State: make UI a pure function

Rule of thumb:

- Interaction produces data
- Data updates state
- State drives rendering

This is what makes component-based UX scalable.

---

# Live demo checkpoint 2

Map click → set results state:

- Location label
- Burn status label + score
- Elevation value
- Access label + distance score

We’ll keep “not ready yet” states simple and visible.

---

# Result tiles: consistent UX, different content

Each tile shares a structure:

- Heading + icon
- One “big number” / short label
- Optional meter
- Description for context

When that repeats, it’s a sign to create a component.

---

# Live demo checkpoint 3

Render a stack of result tiles:

- Location
- Recent Wildfire
- Elevation
- Access

All share the same pattern, but each has its own data.

---

# Componentization: turn repetition into props

When you see repeated markup, extract:

- a styled tile wrapper
- a small set of props for the common UX elements
- a slot/prop for special content

This is how you keep UI changes cheap.

---

# Example: `MorelTile` props (concept)

What we want:

- `heading`, `icon`, `description`
- `bigNumber` (ReactNode)
- `meter` (min/max/value/label)
- optional extra content

Then `MorelPanel` builds a `resultsTiles` array and maps over it.

---

# Live demo checkpoint 4

Refactor to data-driven rendering:

- Build a `resultsTiles` list from state
- `resultsTiles.map(tile => <MorelTile ... />)`

Outcome: adding a tile becomes “add an object,” not “copy/paste markup.”

---

# Slots — what are they?

- A slot is a placeholder inside a web component that you can fill with your own
  markup (including other components).
- Components can have multiple slots, and you can choose which slot to fill.
- This makes components flexible without forking or rewriting them.

---

# Calcite components and slots

- Calcite components are designed with slots to allow developers to customize
  and extend their functionality.
- For example, `calcite-panel` has a default slot for the panel content.
- Named slots let you place content in specific areas like header/footer.

---

# ArcGIS map components: slots for UI placement

- `arcgis-map` exposes named slots
- Place UI in familiar view positions:
  - `top-left`, `top-right`, `bottom-left`, `bottom-right`

Beginner-friendly way to build map controls without brittle CSS.

---

# `reference-element`: keep overlays aligned

When you position components near the map, you often want:

- consistent alignment
- correct stacking
- responsive behavior

`reference-element` helps components anchor to the right DOM element in complex
layouts.

---

# Accessibility + responsiveness (quick wins)

- Prefer component patterns that come with good defaults
- Keep labels meaningful (headings, meter labels)
- Make empty states explicit (e.g., “Tap map”)
- Design for touch: don’t rely on hover

---

# Troubleshooting mindset

If the UI doesn’t behave as expected:

- Check what state is set (before debugging styling)
- Verify the right slot is used (`slot="..."`)
- Confirm values are in expected ranges (meters)
- Reduce: render one tile → then scale back up

---

# Recap

- Use Calcite to establish layout and consistent UX patterns
- Use map component slots to place UI naturally around the view
- Model UX as data: interaction → state → render
- Extract repeated patterns into composable app components

---

# Next session

[ArcGIS Maps SDK for JavaScript: App Development with Components, Part 4: Extending and Styling](https://registration.esri.com/flow/esri/26epcdev/deveventportal/page/detailed-agenda/session/1761122138829001Iinc)

**When**: This afternoon (Thursday, March 12) | 1:00 - 2:00PM PDT

**Where**: Primrose A | Palm Springs Convention Center

> Join us for the fourth technical session in a four-part series on building
> applications with the ArcGIS Maps SDK for JavaScript. This session showcases
> branding and styling strategies to create rich theming and customization in
> your apps using Calcite design tokens and ArcGIS Maps SDK for JavaScript
> component tokens. Explore how you can use light and dark modes in your app
> that will apply to both Calcite and SDK components. Finally, learn how you can
> use component slots for integrating your custom workflows and further tune
> your app's UI/UX.

---

## layout: center

# Questions?

ArcGIS Maps SDK for JavaScript: App Development with Components, Part 3: User
Experience

Demos and additional resources available at: TODO: Link

TODO: QR code

<!--
If you wish to dive deeper, you can find our demos and
additional resources at the URL above, or you can scan the QR code.
-->

---

## src: ../.meta/footer.md
