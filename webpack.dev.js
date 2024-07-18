/* global require, module */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: './dist',
        open: true,
        port: 9000,
        historyApiFallback: true,
    },
});
