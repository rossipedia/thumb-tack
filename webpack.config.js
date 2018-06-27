const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const node_env = process.env.NODE_ENV || 'development';
const package = require('./package.json');

module.exports = env => ({
    mode: node_env,
    devtool: node_env === 'production' ? false : 'source-map',
    entry: {
        extension: './src/extension',
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
    optimization: {
        splitChunks: {},
        minimizer:
            node_env === 'production'
                ? [
                      new UglifyJsPlugin({
                          uglifyOptions: {
                              compress: {
                                  drop_console: true,
                              },
                          },
                      }),
                  ]
                : undefined,
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([
            'src/manifest.json',
            { from: 'src/*.{png,svg}', flatten: true },
        ]),
        new HtmlWebpackPlugin({
            title: 'Thumbtack Options',
            minify: false,
            filename: 'options.html',
            chunks: ['options-ui'],
            template: path.resolve(__dirname, 'src', 'options-ui.html'),
        }),
    ].concat(
        env === 'pack'
            ? [
                  new ZipPlugin({
                      path: __dirname,
                      filename: 'thumb-tack-' + package.version + '.zip',
                  }),
              ]
            : [],
    ),
});
