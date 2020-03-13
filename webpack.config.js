const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const node_env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: node_env,
  devtool: node_env === 'production' ? false : 'source-map',
  entry: {
    'extension': './src/extension',
    'options-ui': './src/options-ui',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      'src/manifest.json',
      {from: 'src/*.{png,svg}', flatten: true},
    ]),
    new HtmlWebpackPlugin({
      title: 'Thumbtack Options',
      minify: false,
      filename: 'options.html',
      chunks: ['options-ui'],
      template: path.resolve(__dirname, 'src', 'options-ui.html'),
    }),
  ],
};
