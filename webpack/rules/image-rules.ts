import { RuleSetRule } from 'webpack';
import { fontPaths } from '../constants';

export const imageRules: RuleSetRule = {
  test: /\.(jpg|jpeg|png|gif|svg|webp|ico)$/,
  exclude: fontPaths,
  type: 'asset/resource',
  generator: {
    filename: 'assets/images/[name][ext]',
  },
};
