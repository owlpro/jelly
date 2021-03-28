const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')

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
    // resolve: {
    //     alias: {
    //         react: path.resolve('./node_modules/react'),
    //         'react-dom': path.resolve('./node_modules/react-dom'),
    //         'react-redux': path.resolve('./node_modules/react-redux'),
    //         '@material-ui/core': path.resolve('./node_modules/@material-ui/core'),
    //         '@material-ui/icons': path.resolve('./node_modules/@material-ui/icons'),
    //         '@material-ui/lab': path.resolve('./node_modules/@material-ui/lab'),
    //         '@material-ui/pickers': path.resolve('./node_modules/@material-ui/pickers'),
    //     },
    // },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [new webpack.HotModuleReplacementPlugin(), new WebpackCleanupPlugin()],
}
