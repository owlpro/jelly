const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')

module.exports = {
    mode: 'production',
    entry: './src/module.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'module.bundle.js',
        library: 'jelly-smart-crud',
        libraryTarget: 'commonjs2',
        publicPath: '/dist/',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    publicPath: 'built',
                },
            },
        ],
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [new webpack.HotModuleReplacementPlugin(), new WebpackCleanupPlugin()],
}
