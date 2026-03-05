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

# What you'll get from this session

- A simple mental model for building UI with web components
- A practical layout pattern using Calcite (shell + panels)
- How ArcGIS map components fit into that layout (and how slots help)
- Demo of building a map-centered app with these ideas

---
layout: two-cols-header
---

# Getting started: Calcite shell component

::left::

- The `calcite-shell` component provides a flexible layout for your application,
  with slots for a header, footer, and main content area.
- It's the foundational component for building a consistent and responsive user
  interface in your web app, allowing you to easily organize your content and
  components.
- It provides slots for embedding additional calcite components, such as
  navigation, panels, and more, making it easy to create a cohesive user
  experience.

::right::

![calcite-shell](./assets/calcite-shell.png)

---

# Slots - What are they?

- A slot is a placeholder inside a web component that you can fill with your own
  markup, which can include other components.
- Components can have multiple slots, and you can choose which slot to fill with
  your content.
- This allows for greater flexibility and customization when using web
  components

---

# Demo - using the shell component and slots

- We will build a simple shell application that utilizes the `calcite-shell`
  component and its slots to create a layout for our app.

---
layout: two-cols-header
---

# Shell recap

::left::

- The `calcite-shell` component provides a flexible layout for your application,
  with slots for a navigation header, main content area, and optional side
  panels.

- It can also be used in other parts of your page, providing structure to easily
  organize components like alerts, modals, and more.

::right::

![shell-in-arcade-editor](./assets/shell-in-arcade-editor.png)

<style>
.two-cols-header {
  column-gap: 6rem; /* Adjust the gap size as needed */
}
img {
    scale: 1.3;
}
</style>

---

# Map Components and Slots

- the `arcgis-map` component has named slots available to place content in
  specific areas of the map, such as the top-left, top-right, bottom-left, and
  bottom-right corners of the map view
- https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/#slots

# Reference Element

-

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
