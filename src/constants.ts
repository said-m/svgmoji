import * as packageJson from '../package.json';
import { SourcesEnum } from './interfaces';

export const PROJECT_INFO = {
  name: packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1),
  version: packageJson.version,
  author: packageJson.author,
  description: packageJson.description,
};

export const CONTEXT_MENU_ITEM_NAMES = {
  root: 'root',
  [SourcesEnum.twemoji]: SourcesEnum.twemoji,
  [SourcesEnum.noto]: SourcesEnum.noto,
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
};

export const HISTORY_LENGTH = 50;
