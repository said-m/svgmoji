import { RuleSetRule } from 'webpack';
import sveltePreprocess from 'svelte-preprocess';

export const frameworkRules: Array<RuleSetRule> = [
  {
    test: /\.svelte$/,
    use: {
      loader: 'svelte-loader',
      options: {
        preprocess: sveltePreprocess({}),
      },
    },
  },
  {
    test: /node_modules\/svelte\/.*\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  }
];
