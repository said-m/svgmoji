import { resolve } from 'path';
import { ROOT_PATH } from '../constants';

export const getPath = (...path: Array<string>) => resolve(ROOT_PATH, ...path);

export const getPagePath = (name: string) => getPath(`pages/${name}/index.ts`);
