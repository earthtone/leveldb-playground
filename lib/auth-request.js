module.exports = authorizeRequest;

var to = require('to2');
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

function authorizeRequest(req, res, db, callback){
	var query = url.parse(req.url, true).query;
	var token = req.headers.authorization && req.headers.authorization.match(/bearer/i) 
		? req.headers.authorization.split(' ')[1] 
		: query 
			? query.token 
			: null; 

	if(token){
		db.createReadStream({ gt: 'user!', lt: 'user!~', })
			.pipe(to.obj(function(row, enc, next){
				if(row.value.token && row.value.token === token){
					return callback()
				} 

				next();
			}));
	} else {
		res.statusCode = 401;
		res.write(JSON.stringify({ error: 'Invalid authorization token' }));
		return res.end();
	}
}
