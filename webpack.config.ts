import { isPlainObject } from '@said-m/common';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';
import { ConfigurationFactory, ProgressPlugin } from 'webpack';
import ExtensionReloaderPlugin from 'webpack-extension-reloader';
import { PROJECT_INFO } from './src/constants';
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
    devtool: 'inline-source-map',
    optimization: {
      minimize: isProd,
    },
    devServer: {
      contentBase: BUILD_PATH,
      compress: true,
      port: 8080,
    },
    entry: {
      background: getPath('background'),
      'content-script': getPath('content-script'),
      popup: getPagePath('popup'),
    },
    output: {
      path: BUILD_PATH,
      filename: chunkData => {
        switch (chunkData.chunk.name) {
          case 'background':
          case 'content-script':
            return '[name].js';
        }

        return '[name]/[name].js';
      },
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
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new ProgressPlugin(),

      new CopyPlugin({
        patterns: [
          {
            from: getPath('static'),
            to: resolve(BUILD_PATH, 'assets'),
          },
          {
            from: getPath('manifest.json'),
            transform (buffer) {
              const manifest = JSON.parse(buffer.toString());

              manifest.name = PROJECT_INFO.name;
              manifest.version = PROJECT_INFO.version;
              manifest.author = PROJECT_INFO.author;
              manifest.description = PROJECT_INFO.description;

              return JSON.stringify(manifest, null, 2);
            },
          },
        ],
        options: {
          concurrency: 100,
        },
      }),

      // Страницы
      getHtmlPlugin({
        page: 'popup',
      }),

      // @ts-ignore
      new ExtensionReloaderPlugin({
        port: 8080,
        reloadPage: true,
        entries: {
          background: 'background',
          contentScripts: ['content-script'],
          extensionPage: ['popup'],
        },
      }),
    ],
  };
};

export default webpackConstructor;
