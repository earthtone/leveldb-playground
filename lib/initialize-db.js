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

async function initializeDatabase ( db, options ) {
	console.log(chalk.cyan.dim('⚡️ Intializing database'));
	var remoteAssets = await requestRemoteAssets(options);

	db.put('user!dW5kZWZpbmVkOnVuZGVmaW5lZA==', { 
		token: 'FCTGtQDKDgGLiiopqUE93'
	});

	console.log(chalk.cyan.dim('⚡️ Saving remote assets'));
	//console.log(remoteAssets);
	
	var batch = remoteAssets.data.map(function(datum){
		return {
			key: `gif!${datum.id}`,
			value: datum	
		};	
	});

	db.batch(batch, function (err) {
		if(err) console.log(err);
	});

	console.log(chalk.green('🎉 Remote assets saved.'));
}
