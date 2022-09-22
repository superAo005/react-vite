//webpack.config.js
// 不用拆分config文件来根据环境设置缓存，并且配置已经尽可能简化，拆分反而会增加维护成本
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css拆分
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // css压缩
const TerserPlugin = require('terser-webpack-plugin') // 使用 terser 压缩 js （terser 是一个管理和压缩 ES6+ 的工具）
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin') // 避免webpack中检测ts类型
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // webpack打包体积可视化分析
const ESLintPlugin = require('eslint-webpack-plugin')

const { DEV, DEBUG } = process.env

process.env.BABEL_ENV = DEV ? 'development' : 'production'
process.env.NODE_ENV = DEV ? 'development' : 'production'
const resolve = dir => path.resolve(__dirname, dir) //我这里为了方便直接引入了最里层
module.exports = {
	// entry: './src/main.jsx',
	performance: {
		hints: false,
	},
	target: 'web',
	resolve: {
		modules: ['node_modules'],
		extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.less', 'scss'],
		alias: {
			// __dirname  可以获取被执行 js 文件的绝对路径
			//'@': resolve(__dirname,'src')// 这样引入的写法引入const {resolve } = require('path')
			'@': resolve('src'), // 这样配置后 @ 可以指向 src 目录
			'@src': path.resolve(__dirname, 'src'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@components': path.resolve(__dirname, 'src/components'),
		},
	},
	devtool: 'inline-source-map', // 帮助发现错误
	entry: {
		index: path.join(__dirname, 'src/index.js'),
	},
	output: {
		path: path.join(__dirname, '/dist'),
		// filename: 'bundle.js',
		clean: true,
		filename: 'js/[name].[hash:7].js',
		assetModuleFilename: 'images/[name].[hash][ext][query]',
		publicPath: '/', //这个是为了解决二级菜单刷新报错的问题，假如不加刷新后会去寻找当前路径的下打包后的css或者js，导致报错，所以要改设置为根路径
	},
	devServer: {
		port: 8080,
	},
	mode: DEV ? 'development' : 'production',
	devtool: DEV && 'source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			// 处理 .less
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					// less-loader
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								// 替换antd的变量，去掉 @ 符号即可
								// https://ant.design/docs/react/customize-theme-cn
								modifyVars: {
									'primary-color': '#1DA57A',
									'border-color-base': '#d9d9d9', // 边框色
									'text-color': '#d9d9d9',
								},
								javascriptEnabled: true, // 支持js
							},
						},
					},
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: !!DEV,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: !!DEV,
						},
					},
				],
			},
			{
				test: /\.png/,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(csv|tsv)$/i,
				use: ['csv-loader'],
			},
			{
				test: /\.xml$/i,
				use: ['xml-loader'],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: false,
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
		minimize: !DEV,
		splitChunks: {
			minSize: 500000,
			cacheGroups: {
				vendors: false,
			},
		},
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'react-admin',
			template: path.join(__dirname, './index.html'),
			filename: 'index.html',
			// inject: 'body',
		}),
		DEBUG && new BundleAnalyzerPlugin(),
		new MiniCssExtractPlugin({
			// filename: '[name].css',
			// chunkFilename: '[name].css',
			filename: 'css/[name].[contenthash].css',
			// chunkFilename: 'css/[id].css'
		}),
		new ESLintPlugin(),
		new ForkTsCheckerWebpackPlugin(),
	].filter(Boolean),
}
