module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
          },
        },
      ],
      ['@babel/plugin-transform-flow-strip-types'],
      ['react-native-reanimated/plugin'],
      ['module:react-native-dotenv'],
    ],
  };
};
