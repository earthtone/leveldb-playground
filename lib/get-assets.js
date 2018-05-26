module.exports = getAssets;

var concat = require('concat-stream');
var authorizeRequest = require('./auth-request');

/**
	*
	* Get All Asset Records from Database
	* @function
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

function getAssets (router, db){
	router.route('GET', `${process.env.URL_BASE}/assets`, function (req, res, ctx) {
		authorizeRequest(req, res, db, function(){
			db.createReadStream({ gt: 'asset!', lt: 'asset!~'})
				.pipe(concat(function( records, enc) {
					var response = records.reduce(function(accumulator, current){
						accumulator[current.key.split('!')[1]] = current.value;
						return accumulator;
					}, {})

					res.statusCode = 200;
					res.write(JSON.stringify(response, null, 2));
					return res.end();
				}));
		});
	});
}
