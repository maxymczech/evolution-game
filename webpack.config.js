const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devServer: {
    contentBase: './dist',
    port: 9000
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components|dist)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties"
          ]
        }
      }, {
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      }]
    }, {
      test: /\.s[ac]ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ],
    }]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new StylelintPlugin()
  ]
};
