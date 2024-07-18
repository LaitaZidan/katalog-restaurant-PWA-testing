const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/scripts/index.js'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: './src/templates/index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/templates/restaurant-detail.html',
            filename: 'restaurant-detail.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/templates/favorite-restaurant.html',
            filename: 'favorite-restaurant.html',
        }),
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            swDest: './sw.bundle.js',
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/restaurant-api\.dicoding\.dev/,
                    handler: 'StaleWhileRevalidate', // Strategi caching untuk API
                },
                {
                    urlPattern: /^https:\/\/restaurant-api\.dicoding\.dev\/images\/small\//,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'small-images-cache',
                        expiration: {
                            maxEntries: 50, // Jumlah maksimal entri di cache
                            maxAgeSeconds: 7 * 24 * 60 * 60, // Umur maksimal cache dalam detik (7 hari)
                        },
                    },
                },
                {
                    urlPattern: /^https:\/\/restaurant-api\.dicoding\.dev\/images\/medium\//,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'medium-images-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 7 * 24 * 60 * 60,
                        },
                    },
                },
                {
                    urlPattern: /^https:\/\/restaurant-api\.dicoding\.dev\/images\/large\//,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'large-images-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 7 * 24 * 60 * 60,
                        },
                    },
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/public/'),
                    to: path.resolve(__dirname, 'dist/'),
                },
            ],
        }),
        new ImageminWebpackPlugin({
            plugins: [
                ImageminMozjpeg({
                    quality: 50,
                    progressive: true,
                }),
            ],
        }),
    ],
    stats: {
        errorDetails: true, // Menampilkan detail kesalahan
    },
};
