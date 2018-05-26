module.exports = getAsset;
var authorizeRequest = require('./auth-request');

/**
	*
	* Get Asset Record from Database
	* @function
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

function getAsset (router, db) {
	router.route('GET', `${process.env.URL_BASE}/assets/:jobnum`, function (req, res, params) {
		authorizeRequest(req, res, db, async function(){
			var response = await db.get(`asset!${params.jobnum}`);

			res.statusCode = 200;
			res.write(JSON.stringify(response, null, 2));
			res.end();
		});
	});
}
