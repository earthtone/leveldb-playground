module.exports = getAssets;

var iter = require('stream-to-iterator');
var authorizeRequest = require('./auth-request');

/**
	*
	* Get All Asset Records from Database
	* @function
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

async function getAssets (req, res, ctx){
	await authorizeRequest(req, res, ctx);

	var { db } = ctx;
	var response = {};			
  var stream =	iter(db.createReadStream({ gt: 'gif!', lt: 'gif!~' }))
  for await ( let { key, value } of stream){
		delete value.images;
		response[key.split('!')[1]] = value;	
	}
  console.log(response);

	res.statusCode = 200;
	res.write(JSON.stringify(response, null, 2));
	return res.end();
}
