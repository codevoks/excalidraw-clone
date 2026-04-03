/**
 * Centralized DOM class names for the draw toolbar.
 * Styles live in `app/globals.css` (@layer components).
 */
export const toolbarClass = {
  root: "canvas-toolbar",
  rail: "canvas-toolbar__rail",
} as const;

export const toolbarEntryClass = {
  root: "canvas-toolbar-entry",
  selected: "canvas-toolbar-entry--selected",
  icon: "canvas-toolbar-entry__icon",
  label: "canvas-toolbar-entry__label",
} as const;
