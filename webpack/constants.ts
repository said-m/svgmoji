import { resolve } from 'path';
import { description, name } from '../package.json';

export const ROOT_PATH = resolve(__dirname, '../src');
export const BUILD_PATH = resolve(__dirname, '../dist');

export const TS_REGEX = /\.ts$/i;
export const SASS_REGEX = /\.(scss|sass)$/i;
export const SASS_MODULE_REGEX = /\.module\.(scss|sass)$/i;

export const fontPaths: Array<string> = [
  // resolve(__dirname, '../node_modules/@fortawesome/fontawesome-free/webfonts'),
];

export const TEMPLATE_VARIABLES = {
  PUBLIC_URL: '',
  STATIC_PATH: '/assets',
  PROJECT_NAME: name.replace(
    /^\w/,
    firstLetter => firstLetter.toUpperCase(),
  ),
  PROJECT_DESCRIPTION: description,
} as const;
