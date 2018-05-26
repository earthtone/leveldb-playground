module.exports = requestRemoteAssets

var chalk = require('chalk');
var fetch = require('node-fetch')

/**
	* 
	* @function
	* @async
	* @param {Object} db - Instance of application database
	* @param {Callback} callback
	*
	* */

async function requestRemoteAssets(){
	console.log(chalk.yellow.dim('✨ Requesting remote assets'));

	try{ 
		var remoteRequest = await fetch(process.env.API);

		console.log(chalk.yellow.dim('✨ Receiving remote assets'));

		var remoteResponse = await remoteRequest.json();

		return remoteResponse; 
	} catch (err) {
		console.error(err);
	}
}
