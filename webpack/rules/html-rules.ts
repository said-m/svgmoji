import _ from 'lodash';
import { TEMPLATE_VARIABLES } from '../constants';

export const htmlRules = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        preprocessor: (content: string) => {
          let result;

          try {
            result = _.template(content)({
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
