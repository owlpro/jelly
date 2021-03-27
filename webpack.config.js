const path = require('path')
module.exports = {
    entry: './src/module.js',
    mode: 'production',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'module.bundle.js',
        // libraryTarget: 'commonjs2',
        library: 'jelly-smart-crud',
        libraryTarget: 'umd',
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
    externals: {
        // Don't bundle react or react-dom
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'React',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'ReactDOM',
            root: 'ReactDOM',
        },
    },
}
