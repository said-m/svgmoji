import { ISources } from "@/constants/sources";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  textSelected(s: string): void;
  copyEmoji(s: { emoji: string; source: ISources }): string;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
