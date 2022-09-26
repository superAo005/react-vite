const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 费时分析 在 webpack5.x 中为了使用费时分析去对插件进行降级或者修改配置写法是非常不划算的，这里因为演示需要，我后面会继续使用，但是在平时开发中，建议还是不要使用
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin') //webpack5 内置了terser-webpack-plugin 插件

const smp = new SpeedMeasurePlugin()
const isDev = process.env.NODE_ENV
console.log('process.env.NODE_ENV=', isDev) // 打印环境变量
// 路径处理方法
function resolve(dir) {
  return path.join(__dirname, dir)
}
const config = {
  performance: {
    hints: false,
  },
  target: 'web',
  resolve: {
    extensions: ['.less', '.js', '.jsx'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@': resolve('src'),
    },
    modules: [resolve('src'), 'node_modules'], // webpack 解析模块时应该搜索的目录
  },
  devtool: 'inline-source-map', // 帮助发现错误
  entry: {
    index: path.join(__dirname, 'src/index.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'js/[name].[hash:7].js',
    assetModuleFilename: 'images/[name].[hash][ext][query]',
    publicPath: '/', //这个是为了解决二级菜单刷新报错的问题，假如不加刷新后会去寻找当前路径的下打包后的css或者js，导致报错，所以要改设置为根路径
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 60000,
      maxSize: 200000,
    },
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                // 按需引入antd
                [
                  require.resolve('babel-plugin-import'),
                  {
                    libraryName: 'antd', //暴露antd
                    libraryDirectory: 'es',
                    style: true,
                  },
                ],
              ],
              cacheDirectory: true, // 启用缓存 babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存 缓存位置： node_modules/.cache/babel-loader
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // webpack5 已经弃用url-loader，file-loader 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // {
          //   loader: 'style-loader'
          // },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          //webpack 5 自定义主题
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              // publicPath: './',
            },
          },
          // {
          //   loader: 'style-loader'
          // },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#1DA57A',
                },
                javascriptEnabled: true, // 此项不能忘
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    // contentBase
    static: {
      directory: path.join(__dirname, 'public/'),
    },
    devMiddleware: {
      publicPath: '/dist/',
    },
    static: './public',
    port: 8080, // 端口号
    // hotOnly
    hot: 'only',
    open: true,
    client: { progress: true },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlPlugin({
      title: 'react-admin',
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
    }),
    new BundleAnalyzerPlugin({
      // analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      // chunkFilename: 'css/[id].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  // return config
  return smp.wrap(config)
}
