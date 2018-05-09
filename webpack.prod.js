process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  // devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        oneOf: [
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.build.json',
                transpileOnly: 'true'
              },
            },
          },
          {
            test: /\.css$/,
            // use: ExtractTextPlugin.extract({
            //   fallback: 'style-loader',
            //   use: 'css-loader',
            // }),
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|gif|svg|xml)$/,
            use: ['file-loader'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader'],
          },
        ],
      },
    ],
  },
  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'API_BASE_URL',
      'API_APPLICATION_ID',
      'CSL_DATA_URL',
      'SENTRY_PUBLIC_DSN',
      'SYNC_GATEWAY_URL'
    ])
    // new ExtractTextPlugin({
    //   allChunks: true,
    //   // filename: '[name].[contenthash].css',
    // }),
  ]
})
