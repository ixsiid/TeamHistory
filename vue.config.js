const path = require('path');

module.exports = {
	outputDir: path.resolve(__dirname, 'docs'),
	pages: {
		index: {
			entry: 'src/main.js',
			title: 'ウマ娘 チームレースの記録',
		},
		test: {
			entry: 'src/test.js',
			title: 'テストページ',
			filename: 'test',
		},
	},
	publicPath: "./",
};
