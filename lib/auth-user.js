module.exports = authenticateUser;

var concat = require('concat-stream');

/**
	*
	* Authenticate User with Username/Password
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

function authenticateUser (router, db) {
	router.route('POST', `/user/auth`, function (req, res, ctx){
		req.pipe(concat(async function(buf, enc){
			var { username, password } = JSON.parse(buf.toString());
			var creds = Buffer.from(`${username}:${password}`).toString('base64');

			try {
				var rec = await db.get(`user!${creds}`);
				res.statusCode = 200;
				res.write(JSON.stringify(rec));
				return res.end();
			} catch (err) {
				if(!rec || err.message.match(/key not found/i)){
					res.statusCode = 404;
					res.write(JSON.stringify({ error: 'Invalid Credentials' }));
					return res.end();
				}	else {
					console.error(err);
					res.statusCode = 500;
					res.write(JSON.stringify({ error: 'Internal server error' }));
					return res.end();
				}
			}
		}));
	});
}

