const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        assetModuleFilename: '[name][ext]'
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/template.html"],
        port: 8080,
        open: true,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
        })
    ],
    module: {
        rules: [         
            { test: /\.(sass|less|css)$/, use: ["style-loader", "css-loader", 'sass-loader'],},
            { test: /\.html$/i, loader: "html-loader",},   
            { test: /\.(png|jpg|jpeg|gif)$/i, type: "asset/resource"},
            { test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"]},
        ],
    },
}; 