module.exports = authorizeRequest;

var iter = require('stream-to-iterator');
var url = require('url');

/**
	*
	* Authorize Request with Header
	* @function
	* @param {Object} req - Server request object
	* @param {Object} res - Server response object
	* @param {Object} db - Instance of application database
	* @param {Callback} callback
	*
	* */

async function authorizeRequest(req, res, { db }){
	var query = url.parse(req.url, true).query;
	var token = req.headers.authorization && req.headers.authorization.match(/bearer/i) 
		? req.headers.authorization.split(' ')[1] 
		: query 
			? query.token 
			: null; 

	if(!token){
		res.statusCode = 401;
		res.write(JSON.stringify({ error: 'Invalid authorization token' }));
		return res.end();
	} else {
		for await ( let row of iter(db.createReadStream({gt: 'user!'}))){
			if(row.value.token && row.value.token === token){
				return true ;
			}
		}
	}
}
