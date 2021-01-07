import HtmlWebpackPlugin, { Options } from 'html-webpack-plugin';
import { getPath } from './get-path';

export const getHtmlPlugin = ({
  page,
  override = {},
}: {
  page: string,
  override?: Options,
}) => new HtmlWebpackPlugin({
  chunks: [page],
  template: getPath('static/index.html'),
  filename: `${page}/index.html`,
  ...override,
});
