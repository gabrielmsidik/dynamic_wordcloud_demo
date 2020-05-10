const path = require('path');

module.exports = {

    // 1. Use the src/index.js file as entry point to bundle it.
    entry: './src/index.js',

    // 2. 
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
        chunkFilename: 'bundle.js',
    },

    devServer: {
        contentBase: './dist',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}