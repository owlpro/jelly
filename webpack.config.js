const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/module.js',
    // devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'module.bundle.js',
        // libraryTarget: 'amd',
        library: 'jelly-smart-crud',
        // libraryTarget: 'umd',
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
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-redux': path.resolve('./node_modules/react-redux'),
        },
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [new webpack.HotModuleReplacementPlugin()],
    // resolve: {
    //     extensions: ['.js', '.jsx'],
    // },
    // externals: [
    //     {
    //         'escape-string-regexp': 'escape-string-regexp',
    //         flat: 'flat',
    //         linkifyjs: 'linkifyjs',
    //         'snake-case': 'snake-case',
    //         react: {
    //             root: 'React',
    //             commonjs2: 'react',
    //             commonjs: 'react',
    //             amd: 'react',
    //         },
    //     },
    // ],
}
