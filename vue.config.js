const path = require('path');
const fs = require('fs');

module.exports = {
	outputDir: path.resolve(__dirname, 'docs'),
	pages: {
		index: {
			entry: 'src/main.js',
			title: 'TeamHistory',
		}
	},
};
