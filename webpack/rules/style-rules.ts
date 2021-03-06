import { RuleSetRule } from 'webpack';
import { SASS_MODULE_REGEX, SASS_REGEX } from '../constants';
import { getStyleLoaders } from '../helpers/get-style-loaders';

export const sassRules: RuleSetRule = {
  test: SASS_REGEX,
  exclude: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(),
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      }
    },
  ],
};

export const sassModuleRules: RuleSetRule = {
  test: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(true),
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      }
    },
  ],
};
