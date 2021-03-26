const path = require('path')
module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
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
            // {
            //     test: /\.js$/,
            //     include: path.resolve(__dirname, 'src'),
            //     exclude: /(node_modules|bower_components|build)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['env'],
            //         },
            //     },
            // },
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
