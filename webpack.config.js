const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.bundle.js"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.csv$/,
                loader: 'csv-loader',
                options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/images/black-heart.png"
        })
    ]
};
