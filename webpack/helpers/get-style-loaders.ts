
export const getStyleLoaders = (isModule = false) => {
  const loaders = [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: isModule,
      },
    },
    'resolve-url-loader',
  ];

  return loaders;
};
