import { RuleSetRule } from 'webpack';
import { SASS_MODULE_REGEX, SASS_REGEX } from '../constants';
import { getStyleLoaders } from '../helpers';

export const sassRules: RuleSetRule = {
  test: SASS_REGEX,
  exclude: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(),
    'sass-loader',
  ],
};

export const sassModuleRules: RuleSetRule = {
  test: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(true),
    'sass-loader',
  ],
};
