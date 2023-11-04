module.exports = {
    plugins: [
      require('postcss-purgecss')({
        content: ['./index.html', './src/**/*.vue', './src/**/*.js'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
    ],
  };
  