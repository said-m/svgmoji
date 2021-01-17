import { RuleSetRule } from 'webpack';
import { fontPaths } from '../constants';
import { getPath } from '../helpers';

export const staticRules: RuleSetRule = {
  test: getPath('static'),
  include: fontPaths,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets',
      },
    },
  ],
};
