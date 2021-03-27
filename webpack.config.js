const path = require('path')
module.exports = {
    entry: './src/module.js',
    mode: 'production',
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'module.bundle.js',
        // libraryTarget: 'amd',
        library: 'jelly-smart-crud',
        libraryTarget: 'umd',
        // libraryTarget: 'commonjs2',
        publicPath: '/dist/',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$|\.scss$/,
                use: ['style-loader', 'css-loader'],
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
        extensions: ['.js', '.jsx'],
    },
    externals: [
        {
            'escape-string-regexp': 'escape-string-regexp',
            flat: 'flat',
            linkifyjs: 'linkifyjs',
            'snake-case': 'snake-case',
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
        },
    ],
}
