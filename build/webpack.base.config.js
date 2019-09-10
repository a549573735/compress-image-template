

const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const path = require('path');
const cdn = require('../config/cdn');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// const smw = new SpeedMeasureWebpackPlugin();

module.exports = {
    entry: {
        index: './app.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "plugins": [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                },
                include: path.join(__dirname, '../public'),
                exclude: /node_modules/
            },

            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: 'assets/font/',
                            publicPath: 'assets/font',
                            name: "[name].[hash].[ext]",
                            //    limit: 4096,
                        }
                    }
                ],
                include: path.join(__dirname, '../public'),
                exclude: /node_modules/
            },
            {
                test: /\.(mp3|mp4)$/, use: {
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/music/',
                        publicPath: 'assets/music',
                        name: "[name].[hash].[ext]"
                    }
                }
            },
            {
                test: /\.(html|htm)$/,
                use: {
                    loader: 'html-loader'
                },//html-withimg-loader
                exclude: /node_modules/
            }
        ]
    },
    optimization: { //做优化 默认js 会被内置uglify.js 压缩
        usedExports: true,
        minimizer: [new TerserJSPlugin({
            parallel: true, //开启多个进程压缩 提升速度
            cache: true  //开启缓存
        }), new OptimizeCSSAssetsPlugin({
            cssProcessor: require('cssnano')
        })],
        splitChunks: {
            cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
                vendors: {
                    chunks: "initial",
                    name: 'vendors',  //可以通过'name'配置项来控制切割之后代码块的命名,给多个分割之后的代码块分配相同的名称,所有的vendor 模块被放进一个共享的代码块中,不过这会导致多余的代码被下载所以并不推荐
                    test: /node_modules/,//条件
                    priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                },
                commons: {
                    chunks: "initial",
                    name: 'commons',
                    minSize: 0,//最小提取字节数
                    minChunks: 2, //最少被几个chunk引用
                    priority: -20,
                    reuseExistingChunk: true//    如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                }
            }
        }
    },
    externals: {
        "jquery": '$', // 和cdn 反过来
        "pixi.js": "PIXI"
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            test: /\.(html|htm)$/,
            options: {
                htmlLoader: {
                    ignoreCustomFragments: [/\{\{.*?}}/],
                    root: path.resolve(__dirname, 'assets'),
                    attrs: ['img:src', 'audio:src']
                }
            }
        }),
        new FriendlyErrorsWebpackPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.html'),
            chunks: ['index', 'vendors', 'commons'],
            chunksSortMode: 'manual',
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),

    
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".css", '.scss'],
        alias: {
            '@': path.resolve(__dirname, '../public/')
        }
    }
};
