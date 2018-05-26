module.exports = getAsset;
var authorizeRequest = require('./auth-request');
var iter = require('stream-to-iterator');

/**
	*
	* Get Asset Record from Database
	* @function
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

async function getAsset (req, res, params) {
	await authorizeRequest(req, res, params)
	var { id, db } = params;
	var response = await db.get(`gif!${id}`);
	delete response.images;

	res.statusCode = 200;
	res.write(JSON.stringify(response, null, 2));
	return res.end();
}
