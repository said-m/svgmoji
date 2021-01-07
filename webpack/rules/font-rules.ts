import { fontPaths } from '../constants';

export const fontRules = {
  test: /\.(woff(2)?|ttf|eot|otf|svg)$/,
  include: fontPaths,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '/assets/fonts',
      },
    },
  ],
};
