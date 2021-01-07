import { Rule } from 'webpack';
import { TS_REGEX } from '../constants';

export const tsRules: Rule = {
  test: TS_REGEX,
  exclude: /node_modules/,
  loaders: 'ts-loader',
};
