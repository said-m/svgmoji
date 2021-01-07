import { isPlainObject } from '@said-m/common';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import copyWebpackPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';
import { ConfigurationFactory, EnvironmentPlugin, ProgressPlugin, ProvidePlugin } from 'webpack';
import { BUILD_PATH } from './webpack/constants';
import { getHtmlPlugin } from './webpack/helpers';
import { getPagePath, getPath } from './webpack/helpers/get-path';
import { fontRules, htmlRules, imageRules, sassModuleRules, sassRules, staticRules, tsRules } from './webpack/rules';

const webpackConstructor: ConfigurationFactory = environment => {
  const env = isPlainObject(environment)
    ? environment
    : {
      production: true,
    };

  const isDev = isPlainObject(env) && !!env.development;
  const isProd = isPlainObject(env) && !!env.production;

  return {
    watch: isDev,
    devtool: 'source-map',
    optimization: {
      minimize: isProd,
    },
    devServer: {
      contentBase: BUILD_PATH,
      compress: true,
      port: 8080,
    },
    entry: {
      main: getPagePath('main'),
    },
    output: {
      path: BUILD_PATH,
      filename: chunkData => '[name]/[name].js',
    },
    module: {
      rules: [
        tsRules,
        sassRules,
        sassModuleRules,
        imageRules,
        staticRules,
        fontRules,
        htmlRules,
      ],
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    plugins: [
      // Сборка
      new CleanWebpackPlugin(),
      new ProgressPlugin(),

      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),

      new EnvironmentPlugin({
        NODE_ENV: isProd
          ? 'production'
          : 'development',
        DEBUG: isDev,
      }),

      new copyWebpackPlugin({
        patterns: [
          {
            from: getPath('static'),
            to: resolve(BUILD_PATH, 'assets'),
          },
        ],
        options: {
          concurrency: 100,
        },
      }),

      // Страницы
      getHtmlPlugin({
        page: 'main',
        override: {
          filename: 'index.html',
        },
      }),
      getHtmlPlugin({
        page: 'offline',
      }),
    ],
  };
};

export default webpackConstructor;
