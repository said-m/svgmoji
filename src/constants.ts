import * as packageJson from '../package.json';

export const PROJECT_INFO = {
  name: packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1),
  version: packageJson.version,
  author: packageJson.author,
  description: packageJson.description,
};

export enum ActionsEnum {
  getSelectionValue,
}

export const CONTEXT_MENU_ITEM_NAMES = {
  twemoji: 'twemoji',
} as const;

export const EMOJI_REGEXP = /(?<=^|[^\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier_Base}\uFE0F\u200D]+)(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\u200D)?)+(?=[^\p{Emoji_Presentation}\p{Emoji}\uFE0F\p{Emoji_Modifier_Base}\u200D]+|$)/u;

export const SOURCE_PATH = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg';

export const HISTORY_LENGTH = 50;
