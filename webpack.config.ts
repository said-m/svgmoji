import { isPlainObject } from '@said-m/common';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';
import { ConfigurationFactory, ProgressPlugin } from 'webpack';
import ExtensionReloaderPlugin from 'webpack-extension-reloader';
import * as packageJson from './package.json';
import { BUILD_PATH } from './webpack/constants';
import { getPath } from './webpack/helpers/get-path';
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
    },
    output: {
      path: BUILD_PATH,
      filename: chunkData => {
        switch (chunkData.chunk.name) {
          case 'background':
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
      new CleanWebpackPlugin(),
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

              manifest.name = packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1);
              manifest.version = packageJson.version;
              manifest.author = packageJson.author;

              return JSON.stringify(manifest, null, 2);
            },
          },
        ],
        options: {
          concurrency: 100,
        },
      }),

      // @ts-ignore
      new ExtensionReloaderPlugin({
        port: 8080,
        reloadPage: true,
        entries: {
          background: 'background',
        },
      }),
    ],
  };
};

export default webpackConstructor;
