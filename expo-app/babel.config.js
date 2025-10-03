// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            jose: 'jose/dist/browser/index.js', // browser build for React Native
          },
        },
      ],
    ],
  };
};
