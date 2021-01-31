import * as packageJson from '../package.json';
import { SourcesEnum } from './interfaces';

export const PROJECT_INFO = {
  name: packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1),
  version: packageJson.version,
  author: packageJson.author,
  description: packageJson.description,
};

export const CONTEXT_MENU_SOURCE_ITEMS: Record<
  SourcesEnum,
  SourcesEnum
> = {
  [SourcesEnum.twemoji]: SourcesEnum.twemoji,
  [SourcesEnum.noto]: SourcesEnum.noto,
  [SourcesEnum.openmoji]: SourcesEnum.openmoji,
  [SourcesEnum.emojione]: SourcesEnum.emojione,
  [SourcesEnum.joypixels]: SourcesEnum.joypixels,
} as const;

export const CONTEXT_MENU_ITEM_NAMES = {
  root: 'root',
  placeholder: 'placeholder',
  ...CONTEXT_MENU_SOURCE_ITEMS,
} as const;

export const EMOJI_REGEXP = /(?<=^|[^\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier_Base}\uFE0F\u200D]+)(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\u200D)?)+(?=[^\p{Emoji_Presentation}\p{Emoji}\uFE0F\p{Emoji_Modifier_Base}\u200D]+|$)/u;

export const NOTIFICATION_TYPE_ID_JOINER = '-';

export const SOURCES: {
  [key in SourcesEnum]: {
    title: string;
    path: string;
    joiner: string;
    prefix: string;
    postfix: string;
    transform?: (input: {
      code: string;
    }) => string;
  };
} = {
  [SourcesEnum.twemoji]: {
    title: 'Twemoji',
    path: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg',
    joiner: '-',
    prefix: '',
    postfix: '.svg',
  },
  [SourcesEnum.noto]: {
    title: 'Noto Color Emoji',
    path: 'https://raw.githubusercontent.com/googlefonts/noto-emoji/master/svg',
    joiner: '_',
    prefix: 'emoji_u',
    postfix: '.svg',
  },
  [SourcesEnum.openmoji]: {
    title: 'Openmoji',
    path: 'https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg',
    joiner: '-',
    prefix: '',
    postfix: '.svg',
    transform: ({
      code,
    }) => code.toUpperCase(),
  },
  [SourcesEnum.emojione]: {
    title: 'Emojione',
    path: 'https://raw.githubusercontent.com/joypixels/emojione-legacy/master/svg',
    joiner: '-',
    prefix: '',
    postfix: '.svg',
    transform: ({
      code,
    }) => code.toUpperCase(),
  },
  [SourcesEnum.joypixels]: {
    title: 'JoyPixels (.png)',
    path: 'https://raw.githubusercontent.com/joypixels/emoji-assets/master/png/128/',
    joiner: '-',
    prefix: '',
    postfix: '.png',
  },
};

export const HISTORY_LENGTH = 50;
