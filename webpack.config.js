const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
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
