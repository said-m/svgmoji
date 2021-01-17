import template from 'lodash.template';
import { RuleSetRule } from 'webpack';
import { TEMPLATE_VARIABLES } from '../constants';

export const htmlRules: RuleSetRule = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        preprocessor: (content: string) => {
          let result;

          try {
            result = template(content)({
              ...TEMPLATE_VARIABLES,
            });
          } catch (error) {
            return content;
          }

          return result;
        },
      },
    },
  ],
};
