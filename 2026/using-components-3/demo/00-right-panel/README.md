# 00-right-panel

Presentation step demo: start building a rich right-side “context” panel using
Calcite tiles.

Purpose:

- Show how Calcite tiles/meters can present contextual information.
- Show how the panel is placed using the `arcgis-map` `top-right` slot.

What you’ll see:

- Top navbar: same content as the finished app.
- Map `top-left` slot: real `LayersPanel` from the finished app.
- Map `top-right` slot: real tile components (`MorelPanel` + `MorelTile`) with
  only one tile enabled.

Notes:

- Additional tiles are intentionally commented out for the demo step.
- The tile action button is also commented out (we’ll add it later when
  introducing optional props).

Run:

```bash
npm install
npm run dev
```
