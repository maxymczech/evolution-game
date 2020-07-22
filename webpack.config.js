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
          presets: ['@babel/preset-env']
        }
      }, {
        loader: 'eslint-loader'
      }]
    }]
  }
};
