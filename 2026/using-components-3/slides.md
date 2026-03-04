---
titleTemplate: '%s'
author: Adam Tirella, Nicholas Romano, Kitty Hurley
mdc: true
colorSchema: light
---

## ArcGIS Maps SDK for JavaScript:<br>App Development with Components,<br>Part 3: User Experience

Adam Tirella, Nicholas Romano, Kitty Hurley

---
is: feedback
---

---

# Previous session (yesterday)

App Development with Components Part 2: Using Frameworks

> The session touches on current front-end methodologies for topics such as
> dependency management, asset management, semantic versioning, prebuilt versus
> built applications that scale, and conveniences offered by frameworks that
> streamline web mapping app development compared to plain JavaScript.

If you missed the previous session, we have a recording. These 4-part sessions
build on top of each other

---

# Today's session

3rd in a 4-part series

- We will cover:
  - Calcite Design System - creating a layout
  - @arcgis/map-components - utilizing slots within the map component
  - @arcgis/map-components - reference-element property
  - Utilizing Calcite Components within React to develop composable UI elements

---

# TODO: ...the rest

---

# Slots - What are they?

- A slot is a placeholder inside a web component that you can fill with your own
  markup, which can include other components.
- Components can have multiple slots, and you can choose which slot to fill with
  your content.
- This allows for greater flexibility and customization when using web
  components

---

# Calcite Components and Slots

- Calcite components are designed with slots to allow developers to easily
  customize and extend their functionality.
- For example, the `calcite-panel` component has a default slot for the panel
  content
- You can also use named slots to place content in specific areas of the
  component, such as the header or footer

# Map Components and Slots

- the `arcgis-map` component has named slots available to place content in
  specific areas of the map, such as the top-left, top-right, bottom-left, and
  bottom-right corners of the map view
- https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/#slots

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
layout: center
---

# Questions?

ArcGIS Maps SDK for JavaScript: App Development with Components, Part 3: Using
Frameworks

Demos and additional resources available at: TODO: Link

TODO: QR code

<!--
If you wish to dive deeper, you can find our demos and
additional resources at the URL above, or you can scan the QR code.
-->

---
src: ../.meta/footer.md
---
