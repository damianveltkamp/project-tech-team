const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [__dirname + '/source/main.js', __dirname + '/source/main.scss'],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'source/components'),
      '@sass': path.resolve(__dirname, 'source/sass'),
      '@javascript': path.resolve(__dirname, 'source/javascript'),
    },
  },
};
