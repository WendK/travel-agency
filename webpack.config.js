var path = require('path');

module.exports = {

	mode: 'development',
	entry: "./app/assets/scripts/App.js",
	output: {
		path: path.resolve(__dirname, "./app/temp/scripts"), //process.cwd()
		filename: "App.js"
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