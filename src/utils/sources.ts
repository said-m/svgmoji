import { ISources, SOURCES } from "@/constants/sources";
import { stringToCode } from "./encoding";

export const createLinkToSource = ({
  emoji,
  name,
}: {
  emoji: string;
  name: ISources;
}) => {
  const path = SOURCES[name].path;
  const prefix = SOURCES[name].prefix;
  const postfix = SOURCES[name].postfix;
  const transform = SOURCES[name].transform;

  const parsedCode = stringToCode({
    value: emoji,
    joiner: SOURCES[name].joiner,
  });

  const code = transform
    ? transform({
        code: parsedCode,
      })
    : parsedCode;

  return `${path}/${prefix}${code}${postfix}`;
};
