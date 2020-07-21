module.exports = {
  mode: "production",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components|dist)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
};
