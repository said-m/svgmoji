import { fontPaths } from '../constants';

export const imageRules = {
  test: /\.(jpg|jpeg|png|gif|svg|webp|ico)$/,
  exclude: fontPaths,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/images',
      },
    },
  ],
};
