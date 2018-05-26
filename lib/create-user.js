module.exports = createUser;

var concat = require('concat-stream');
var { randomBytes } = require('crypto');

/**
 * 
 * Create New User Record
 * @function
 * @param {Object} router - Instance of application router
 * @param {Object} db - Instance of application database
 *
 * */

function createUser (router, db) {
	router.route('POST', `/user/create`, function (req, res, ctx) {
		req.pipe(concat(async function (buf, enc){
			var { username, password } = JSON.parse(buf.toString());
			var creds = Buffer.from(`${username}:${password}`).toString('base64');
			var key = `user!${creds}`;
			try {
				let rec = await db.get(key);
				if(rec){
					throw new Error('Record exists');
				}
			} catch (err) {
				if(err.message.match(/key not found/i)){
					try {
						await db.put(key, { 
							token: randomBytes(16).toString('hex')
						});

						let rec = await db.get(key);
						res.statusCode = 200;
						res.write(JSON.stringify(rec));
						return res.end();
					} catch (err) {
						res.statusCode = 500;
						res.write(JSON.stringify({ error: 'Internal server error' }));
						return res.end();
					}
				} else if(err.message.match(/record exists/i)){
					res.statusCode = 409;
					res.write(JSON.stringify({ error: 'User record exists' }));
					return res.end();
				}
			}
		}));
	});
}
