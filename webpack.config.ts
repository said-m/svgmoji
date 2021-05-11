import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve } from 'path';
import { Configuration, ProgressPlugin } from 'webpack';
import ExtensionReloaderPlugin from 'webpack-extension-reloader';
import ZipPlugin from 'zip-webpack-plugin';
import { PROJECT_INFO } from './src/constants';
import { BUILD_PATH } from './webpack/constants';
import { getHtmlPlugin, getScriptRules } from './webpack/helpers';
import { getPagePath, getPath } from './webpack/helpers/get-path';
import { fontRules, frameworkRules, htmlRules, imageRules, sassModuleRules, sassRules } from './webpack/rules';

const webpackConstructor = (
  environments: Record<string, unknown>,
  args: Record<string, unknown>,
): Configuration => {
  const isDev = args.mode === 'development';
  const isProd = args.mode === 'production';

  const mode = typeof args.mode === 'string'
    ? args.mode
    : 'production';

  return {
    devtool: false,
    watchOptions: {
      poll: true,
      aggregateTimeout: 100,
      ignored: /node_modules/
    },
    entry: {
      background: getPath('background'),
      'content-script': getPath('content-script'),
      popup: getPagePath('popup'),
    },
    output: {
      path: BUILD_PATH,
      filename: chunkData => {
        switch (chunkData.chunk?.name) {
          case 'background':
          case 'content-script':
            return '[name].js';
        }

        return '[name]/[name].js';
      },
      assetModuleFilename: 'assets/[name][ext]',
      clean: true,
    },
    optimization: {
      minimize: isProd,
    },
    module: {
      rules: [
        ...getScriptRules({
          mode,
        }),
        ...frameworkRules,
        sassRules,
        sassModuleRules,
        imageRules,
        fontRules,
        htmlRules,
      ],
    },
    resolve: {
      alias: {
        svelte: resolve('node_modules', 'svelte'),
      },
      extensions: ['.ts', '.svelte', '.js', '.mjs', '.json'],
    },
    plugins: [
      // Сборка

      new ProgressPlugin({}),

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

      // Хэлперы

      ...(isDev
        ? [new ForkTsCheckerWebpackPlugin()]
        : []
      ),

      ...(isDev
        // @ts-ignore
        ? [new ExtensionReloaderPlugin({
          port: 8080,
          reloadPage: true,
          entries: {
            background: 'background',
            contentScripts: ['content-script'],
            extensionPage: ['popup'],
          },
        })]
        : []
      ),

      // @ts-ignore
      ...(isProd
          ? [new ZipPlugin({
              filename: `${PROJECT_INFO.name}-${PROJECT_INFO.version}.zip`,
          })]
          : []
      ),
    ],
  };
};

export default webpackConstructor;
