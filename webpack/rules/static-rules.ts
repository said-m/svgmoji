import { fontPaths } from '../constants';
import { getPath } from '../helpers';

export const staticRules = {
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
