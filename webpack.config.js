

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const generaterConfig = ()  => {
	let files = glob.sync('src/**/index.{tsx,ts,js}');
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
			chunks: ['vendor', 'common', entry], //每个html只引入对应的js和css
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

const config = {
	mode: 'production',
	entry: entries,
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name]_[fullhash].js',
		chunkFilename: '[name]_[fullhash].js',
		assetModuleFilename: 'images/[hash][ext][query]'
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
	new CleanWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: '[name]_[fullhash].css',
		chunkFilename: '[name]_[fullhash].css',
	})].concat(htmlWebpackPlugins),
	optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10 // 优先级
                },
                common: {
                    name: "common",
                    test: /[\\/]src[\\/]/,
                    minSize: 1024,
                    chunks: "all",
                    priority: 5
                }
            }
        }
	},
	externals: {
	  'react': 'React',
	  'react-dom': 'ReactDOM',
	},
};

module.exports = config;
