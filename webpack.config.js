const path = require('path')
module.exports = {
    devtool: 'inline-source-map',
    entry: './src/module.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'jelly.smart.crud.js',
        library: 'jelly-smart-crud',
        libraryTarget: 'var',
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
}
