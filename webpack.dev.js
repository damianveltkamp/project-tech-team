/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const defaultWebpackConfig = require('./webpack.config');

module.exports = merge(defaultWebpackConfig, {
  mode: 'development',
  devtool: 'eval',
  watch: true,
  output: {
    path: resolve(__dirname, 'static/build'),
    filename: 'js/main.min.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].min.css' },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3001,
      proxy: 'http://localhost:3000',
      files: ['static/build', 'source/**/*.html', '*.js'],
      notify: false,
    }),
  ],
});
