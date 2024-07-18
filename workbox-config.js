module.exports = {
    globDirectory: 'src/',
    globPatterns: [
        '**/*.{json,jpg,svg,js,scss,html}',
    ],
    swDest: 'src/sw.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/,
        /^s/,
    ],
};
