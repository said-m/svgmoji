import { SOURCES } from '../constants';
import { SourcesEnum } from '../interfaces';
import { stringToCode } from './string-to-code';

export const createLink = ({
  emoji,
  type,
}: {
  emoji: string;
  type: SourcesEnum;
}) => {
  const path = SOURCES[type].path;
  const prefix = SOURCES[type].prefix;
  const postfix = SOURCES[type].postfix;
  const transform = SOURCES[type].transform;

  const parsedCode = stringToCode({
    value: emoji,
    joiner: SOURCES[type].joiner,
  });

  const code = transform
    ? transform({
      code: parsedCode,
    })
    : parsedCode;

  return `${path}/${prefix}${code}${postfix}`;
};
