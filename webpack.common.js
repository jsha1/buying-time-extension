const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

const path = require('path');

module.exports = {
  optimization: {
     minimize: true,
    minimizer: [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true,
        }
      }
    })
    ]
  },
  mode: 'production',
  entry: {
        background: './BuyingTimeExtension/script/background.js',
        popup: './BuyingTimeExtension/script/popup.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script/[name].js'
  },
  module:{
    rules:[
        {
            test:/\.css$/,
             use: ExtractTextPlugin.extract(
              {  fallback: 'style-loader', use:['css-loader']}
            )
        },
   ]
  },
  plugins: [ 
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
        { from: 'BuyingTimeExtension', ignore: [ 'src/*.js' ]},
    ]),
    new MergeIntoSingleFilePlugin({
      files: {
        'script/contentScript.js': [
          path.resolve(__dirname, './BuyingTimeExtension/src/moment.js'),
          path.resolve(__dirname, './BuyingTimeExtension/src/findAndReplaceDOMText.js'),
          path.resolve(__dirname, './BuyingTimeExtension/src/contentScript.js')]
      }
    }),
    new ExtractTextPlugin(
      {filename: 'main.css'}
    ),
    new HtmlWebpackPlugin({
      hash: false,
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
      template: './BuyingTimeExtension/background.html',
      filename: 'background.html'
    }),
  ]
};

