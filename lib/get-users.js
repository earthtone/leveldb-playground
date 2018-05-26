module.exports = getUsers;

var concat = require('concat-stream');

/**
	*
	* Get List of Users
	* @function
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	* 
	* */

function getUsers (router, db) {
	router.route('GET', `/user/list`, function (req, res, ctx) {
		db.createReadStream({ gt: 'user!', lt: 'user!~' })
			.pipe(concat(function (row, enc) {
				var data = row.map(r => Buffer.from(r.key.split('!')[1], 'base64').toString('utf8').split(':')[0]);

				res.statusCode = 200;
				res.write(JSON.stringify(data));
				res.end();
			}));;
	});
}
