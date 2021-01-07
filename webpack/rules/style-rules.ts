import { SASS_MODULE_REGEX, SASS_REGEX } from '../constants';
import { getStyleLoaders } from '../helpers';

export const sassRules = {
  test: SASS_REGEX,
  exclude: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(),
    'sass-loader',
  ],
};

export const sassModuleRules = {
  test: SASS_MODULE_REGEX,
  use: [
    ...getStyleLoaders(true),
    'sass-loader',
  ],
};
