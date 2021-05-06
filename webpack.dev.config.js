

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayWebpackPlugin = require('error-overlay-webpack-plugin');
const generaterConfig = ()  => {
	let files = glob.sync('src/**/index.{tsx,ts,js,jsx}');
	let entries = {};
	let htmlWebpackPlugins = [];
	files.forEach((dir) => {
		const matchs = dir.match(/src\/(.*)\/index\.(js|jsx|ts|tsx)$/);
		const entry =  matchs[1];
		if(!entry) return;
		entries[entry] = __dirname + '/'+ dir;
		htmlWebpackPlugins.push(new HtmlWebpackPlugin({
			filename: entry + '.html',
			cache: true,
			chunks: [entry], //每个html只引入对应的js和css
			inject: 'body',
			template: __dirname+ '/index.html',
			favicon: path.resolve(__dirname, 'src/assets/webpack.svg'),
		}));
	});

	return {
		entries,
		htmlWebpackPlugins
	};
};

const { entries, htmlWebpackPlugins } = generaterConfig();

const config  = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: entries,
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name]_[fullhash].js',
		chunkFilename: '[name]_[fullhash].js',
	},
	resolve:{
		extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.tsx', '.ts'],
		alias: {
		  '@': path.resolve(__dirname, 'src'),
		}
	},
	
	module: {
		rules: [
		  {
			test: /\.(js|jsx|ts|tsx)$/,
			exclude: /node_modules/,
			use: {
			  loader: 'babel-loader',
			  options: {
				presets: ['@babel/preset-env', '@babel/preset-react','@babel/preset-typescript'],
				plugins: [
					["import", { "libraryName": "antd", style: true }],
					// ["@babel/plugin-proposal-decorators", {"legacy": true}],//处理注解
					["@babel/plugin-proposal-class-properties"], // 处理类属性
					["@babel/plugin-syntax-dynamic-import"],
					// ['@babel/plugin-transform-runtime'] //处理 sync 语法糖
				]
				
			  },
			},
		  },
		  {
			test: /\.less$/i,
			exclude: /node_modules/,
			use: [
			  MiniCssExtractPlugin.loader,
			  {
				loader: 'css-loader',
				options: {
				  importLoaders: 1,
				  modules: { localIdentName: '[local]___[hash:base64:5]' },
				},
			  },
			  {
				loader: 'less-loader',
				options: {
				  lessOptions: {
					javascriptEnabled: true, //less 开启 Mixin 新版本推荐使用 @plugins 
				  },
				},
			  },
			],
		  },
		  {
			test: /\.less$/i,
			include: /node_modules/,
			use: [
			   MiniCssExtractPlugin.loader,
			  {
				loader: 'css-loader',
				options: {
				  importLoaders: 1,
				},
			  },
			  {
				loader: 'less-loader',
				options: {
				  lessOptions: {
					javascriptEnabled: true,
				  },
				},
			  },
			],
		  },
		  {
			test: /\.(png|jpg|gif|svg)$/i,
			type: 'asset/resource',
			generator: {
			  filename: 'static/[name]_[hash][ext][query]'
			}
		  }
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[fullhash].css',
			chunkFilename: '[name]_[fullhash].css',
	    }),
		new FriendlyErrorsWebpackPlugin(),
		new ErrorOverlayWebpackPlugin(),
	].concat(htmlWebpackPlugins),
	devServer: {
		port: 3001,
		open: true,
		contentBase: path.join(__dirname, 'dist'),
		host: '127.0.0.1',
	    hot: true,
		// quiet: true
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
	},
};

module.exports = config;
