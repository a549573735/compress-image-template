const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:6].js',
        chunkFilename:"[name].[contenthash:6].min.js",
        publicPath: '/'
    },
    stats:'normal',
    module: {
        rules: [
            // {
            //     test:/\.(js)$/,
            //     loader:'eslint-loader',
            //     include:path.join(__dirname, '../public'),
            //     enforce:'pre',
            //     exclude: /node_modules/
            // },
    
            {   // 处理图片压缩
                test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
                use: [
                    {
                      loader:'file-loader',
                      options:{
                        outputPath:'assets/images/',
                        publicPath:'/assets/images',
                        name:"[name].[ext]"
                      }  
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 70
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            }
                        },
                    }
                ],
                include: path.join(__dirname, '../public'),
                
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*']
        })
    ]
}

