const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const defaultWebpackConfig = require('./webpack.config');
const { merge } = require('webpack-merge');
const path = require('path');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(defaultWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'static/build'),
    filename: 'js/main.min.[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'css/',
              name: '[name].min.[contenthash].css',
            },
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [new CleanWebpackPlugin()],
});
