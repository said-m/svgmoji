export const SOURCE_IDS = [
  "twemoji",
  "noto",
  "openmoji",
  "emojione",
  "joypixels",
] as const;

export type ISources = (typeof SOURCE_IDS)[number];

export interface ISource {
  title: string;
  path: string;
  joiner: string;
  prefix: string;
  postfix: string;
  transform?: (input: { code: string }) => string;
}

export const SOURCES: {
  [key in ISources]: ISource;
} = {
  twemoji: {
    title: "Twemoji",
    path: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg",
    joiner: "-",
    prefix: "",
    postfix: ".svg",
  },
  noto: {
    title: "Noto Color Emoji",
    path: "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg",
    joiner: "_",
    prefix: "emoji_u",
    postfix: ".svg",
  },
  openmoji: {
    title: "Openmoji",
    path: "https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg",
    joiner: "-",
    prefix: "",
    postfix: ".svg",
    transform: ({ code }) => code.toUpperCase(),
  },
  emojione: {
    title: "Emojione",
    path: "https://raw.githubusercontent.com/joypixels/emojione-legacy/master/svg",
    joiner: "-",
    prefix: "",
    postfix: ".svg",
    transform: ({ code }) => code.toUpperCase(),
  },
  joypixels: {
    title: "JoyPixels",
    path: "https://raw.githubusercontent.com/joypixels/emoji-assets/master/png/128/",
    joiner: "-",
    prefix: "",
    postfix: ".png",
  },
};
