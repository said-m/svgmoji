export const CONTEXT_MENU_MODES = {
  nested: "nested",
  simple: "simple",
} as const;
export type IContextMenuModes =
  (typeof CONTEXT_MENU_MODES)[keyof typeof CONTEXT_MENU_MODES];

export const CONTEXT_MENU_MODE_TITLES = {
  nested: "Submenu with a list of sources",
  simple: "Action button at the root of menu (use source priority settings)",
} as const;

export const COPY_MODES = {
  link: "link",
  image: "image",
} as const;
export type ICopyModes = (typeof COPY_MODES)[keyof typeof COPY_MODES];

export const COPY_MODE_TITLES = {
  link: "Link to an image",
  image: "Image",
} as const;
