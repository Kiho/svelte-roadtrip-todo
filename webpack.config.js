var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isDevBuild = mode === 'development'

module.exports = {
  mode,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: { loader: 'svelte-loader', options: { dev: isDevBuild, store: true } },
        exclude: ['/node_modules/', '/index.html']
      },
      { 
        test: /\.ts$/, 
        include: /src/, 
        use: 'ts-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {name: '[name].[ext]?[hash]' }
      },
      {
        test: /\.html$/,
        use: { loader: 'svelte-dts-loader', options: {} },
        include: /src/,
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', 'html'],
  },
  performance: {
    hints: false
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './index.html' },
      { from: './styles', to: 'styles' },
      { from: './fonts', to: 'fonts' },
    ]),
    new webpack.WatchIgnorePlugin([
      /\.js$/,
      /\.d\.ts$/
    ])
  ],
  watchOptions: {
    ignored: 'src/**/*.d.ts'
  },
  devtool: '#eval-source-map'
}

if (!isDevBuild) {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
} else {
  module.exports.devServer = {
    port: 8085,
    host: "localhost",
    historyApiFallback: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    contentBase: './dist',
    open: true,
    // proxy: {
    //     "/api/*": "http://127.0.0.1:3001"
    // }
  };
}