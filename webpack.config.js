const webpack = require('webpack'),
  path = require('path'),
  WebpackNotifierPlugin = require('webpack-notifier'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].css'
});

const PORT = 3000;

function nullFilter(array) {
  return array.filter(item => item);
}

module.exports = {
  entry: {
    main: nullFilter([
      process.env.NODE_ENV !== 'production' ?
          `webpack-dev-server/client?http://localhost:${PORT}/` : null,
      path.join(__dirname, 'src/js/index.js')
    ]),
    style: path.join(__dirname, 'src/scss/index.scss')
  },
  output: {
    path: path.join(__dirname, './public/'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    sourceMapFilename: '[file].map'
  },
  plugins: nullFilter([
    new WebpackNotifierPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './src/index.html')
    }),
    process.env.NODE_ENV !== 'production' ?
        new webpack.HotModuleReplacementPlugin({multistep: true}) :
        false,
    extractSass
  ]),
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
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : 'nosources-source-map',
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
              options: { sourceMap: process.env.NODE_ENV !== 'production' }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: process.env.NODE_ENV !== 'production',
                plugins: (loader) => [
                  require('autoprefixer')(['last 10 version', 'ie >= 10', 'Firefox 15']),
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: process.env.NODE_ENV !== 'production' }
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