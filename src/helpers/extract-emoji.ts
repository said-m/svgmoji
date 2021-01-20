import { EMOJI_REGEXP } from '../constants';

export const extractEmoji = (value: string) => value.trim().match(EMOJI_REGEXP)?.[0];
