import { isPlainObject } from '@said-m/common';
import { RuleSetRule } from 'webpack';
import { tsRules } from '../rules/ts-rules';

export const getScriptRules = ({
  mode,
}: {
  mode: string;
}): Array<RuleSetRule> => [
  {
    ...tsRules,
    options: {
      ...(isPlainObject(tsRules.options))
        ? tsRules.options
        : {},
      transpileOnly: mode === 'development',
    },
  },
];
