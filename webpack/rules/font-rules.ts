import { RuleSetRule } from 'webpack';
import { fontPaths } from '../constants';

export const fontRules: RuleSetRule = {
  test: /\.(woff(2)?|ttf|eot|otf|svg)$/,
  include: fontPaths,
  type: 'asset/resource',
  generator: {
    filename: 'assets/fonts/[name][ext]',
  },
};
