import { RuleSetRule } from 'webpack';
import { TS_REGEX } from '../constants';

export const tsRules: RuleSetRule = {
  test: TS_REGEX,
  exclude: /node_modules/,
  loader: 'ts-loader',
};
