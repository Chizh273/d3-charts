const webpack = require('webpack'),
  path = require('path'),
  WebpackNotifierPlugin = require('webpack-notifier'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].css'
});

const PORT = 3000;

module.exports = {
  entry: {
    main: [
      `webpack-dev-server/client?http://localhost:${PORT}/`,
      path.join(__dirname, 'src/js/index.js')
    ],
    style: path.join(__dirname, 'src/scss/index.scss')
  },
  output: {
    path: path.join(__dirname, './public/'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    sourceMapFilename: '[file].map'
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './src/index.html')
    }),
    new webpack.HotModuleReplacementPlugin({ multistep: true }),
    extractSass
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    compress: true,
    port: PORT,
    inline: true,
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    }
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: (loader) => [
                  require('autoprefixer')(['last 10 version', 'ie >= 10', 'Firefox 15']),
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015', 'es2016', 'es2017',
                'stage-0', 'stage-1', 'stage-2',
                'stage-3'
              ],
              plugins: ['transform-runtime']
            }
          }
        ]
      }
    ]
  }
};