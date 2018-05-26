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

async function requestRemoteAssets(options){
	var query = options._.length ? options._.join('+') : 'mecha'; 
	var url = `${process.env.API_ROOT}/${process.env.API_ENDPOINT}?api_key=${process.env.API_KEY}&q=${query}&limit=27&offset=0&rating=R&lang=en`;	

	try{ 
		console.log(chalk.yellow.dim('✨ Requesting remote assets'));
		var remoteRequest = await fetch(url);

		console.log(chalk.yellow.dim('✨ Receiving remote assets'));
		var remoteResponse = await remoteRequest.json();

		if(remoteResponse.meta.status !== 200){
			throw new Error(remoteResponse.msg);
		}

		return remoteResponse; 
	} catch (err) {
		console.error(err);
	}
}
