const path = require('path');
const os = require('os');
const webpack = require('webpack')
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}



const myHost = getIPAdress();

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash:6].js',
        chunkFilename: "[name].[hash:6].min.js",
        publicPath: '/'
    },
    devtool: "cheap-module-source-map",
    stats: 'minimal',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: myHost,
        compress: true,
        port: 8080,
        hot: true,
        // proxy:{
        //     '/api':{
        //         target:'',
        //         changeOrigin:true, //改变 请求头的 主机源 host
        //         pathRewrite:{
        //              "/api" :""
        //         }
        //     }
        // }
    },
    // watch: true,
    // watchOptions: {
    //     ignored: /node_modules/, //忽略不用监听变更的目录
    //     poll: 1000, //每秒询问的文件变更的次数
    //     aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫秒内重复保存不打包
    // },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            // importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            sourceMap: true
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            sourceMap: true
                        },
                    }
                    , {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            //                         importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            sourceMap: true
                        },
                    }
                ],
                include: path.join(__dirname, '../public'),
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '../dist/assets/images/',
                            publicPath: './assets/images',
                            name: "[name].[ext]"
                        }
                    }
                ]
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
}