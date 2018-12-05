var path = require('path');

module.exports = {

	mode: 'development',
	entry: {
		App: "./app/assets/scripts/App.js",
		Vendor: "./app/assets/scripts/Vendor.js"
	},
	output: {
		path: path.resolve(__dirname, "./app/temp/scripts"), //process.cwd()
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['@babel/preset-env']
				},
				test: /\.js$/,
				exclude: path.resolve(__dirname, 'node_modules')
			}
		]
	}

};