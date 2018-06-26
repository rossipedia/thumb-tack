const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = {
    mode: env,
    devtool: 'source-map',
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
        minimizer: env === 'production' ? [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ] : undefined,
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin(['src/manifest.json']),
        new HtmlWebpackPlugin({
            title: 'Thumbtack Options',
            minify: false,
            filename: 'options.html',
            chunks: ['options-ui'],
            template: path.resolve(__dirname, 'src', 'options-ui.html'),
        }),
    ],
};
