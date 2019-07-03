module.exports = ({ config, mode }) => {
  const webpackConfig = require('../webpack.config.js')(mode);

  config.resolve.extensions = webpackConfig.resolve.extensions;
  config.module.rules = webpackConfig.module.rules.concat([
    {
      test: /\.story\.(j|t)sx?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/addon-storysource/loader'),
          options: { parser: 'typescript' },
        },
      ],
      enforce: 'pre',
    },
  ]);
  return config;
};
