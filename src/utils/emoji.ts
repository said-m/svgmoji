import { EMOJI_REGEXP } from "@/constants/emoji";

export const extractEmojiFromText = (value: string) =>
  value.trim().match(EMOJI_REGEXP)?.[0];
