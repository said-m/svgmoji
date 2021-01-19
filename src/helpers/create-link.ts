import { SOURCES } from '../constants';
import { SourcesEnum } from '../interfaces';
import { stringToCode } from './string-to-code';

export const createLink = ({
  emoji,
  type,
}: {
  emoji: string;
  type: SourcesEnum;
}) => `${SOURCES[type].path}/${SOURCES[type].prefix}${stringToCode({
  value: emoji,
  joiner: SOURCES[type].joiner,
})}${SOURCES[type].postfix}`;
