export const EMOJI_REGEXP =
  /(?<=^|[^\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier_Base}\uFE0F\u200D]+)(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\u200D)?)+(?=[^\p{Emoji_Presentation}\p{Emoji}\uFE0F\p{Emoji_Modifier_Base}\u200D]+|$)/u;
