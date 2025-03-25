import { ISources } from "@/constants/sources";
import { ICopyModes } from "@/constants/storage-data";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  textSelected(s: string): void;
  copyEmoji(s: { emoji: string; source: ISources; mode: ICopyModes }): {
    link: string;
    base64Url?: string;
  };
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
