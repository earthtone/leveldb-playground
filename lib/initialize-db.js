module.exports = initializeDatabase

var chalk = require('chalk');
var requestRemoteAssets = require('./request-remote-assets');

/**
	*
	* Intialize Database with Remote data & 1 User Record
	*
	* @function
	* @async
	* @param {Object} db - Instance of application database
	*
	* */

async function initializeDatabase ( db ) {
	console.log(chalk.cyan.dim('⚡️ Intializing database'));

	var remoteAssets = await requestRemoteAssets();
	var batch = [];

	db.put('user!dGh1YjpyZWQyMw==', { 
		token: 'FCTGtQDKDgGLiiopqUE93'
	});

	console.log(chalk.cyan.dim('⚡️ Saving remote assets'));

	for(let [k, v] of Object.entries(remoteAssets)){
		batch.push({ key: `asset!${k}`, value: v })
	}

	db.batch(batch, function (err) {
		if(err) console.log(err);
	});

	console.log(chalk.green('🎉 Remote assets saved.'));
}
