import { RuleSetRule } from 'webpack';

export const frameworkRules: Array<RuleSetRule> = [
  {
    test: /\.svelte$/,
    use: 'svelte-loader',
  },
  {
    test: /node_modules\/svelte\/.*\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  }
];
