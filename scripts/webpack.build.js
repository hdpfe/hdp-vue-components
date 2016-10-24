var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: path.resolve(__dirname, '../src/hdp-vue-components.js'),

  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
    publicPath: "/",
    filename: "hdp-vue-components.js"
  },

  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },

  vue: {
    loaders: {
      html: 'vue-html?removeRedundantAttributes=false'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]

};
