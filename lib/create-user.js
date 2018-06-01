module.exports = createUser;

var { randomBytes } = require('crypto');

/**
 * 
 * Create New User Record
 * @function
 * @param {Object} router - Instance of application router
 * @param {Object} db - Instance of application database
 *
 * */

async function createUser (req, res, { db }) {
	try {
		for await (let buf of req){
			var { username, password } = JSON.parse(buf.toString());
			var creds = Buffer.from(`${username}:${password}`).toString('base64');
		}

		var key = `user!${creds}`;

		let rec = await db.get(key);
		if(rec){
			throw new Error('Record exists');
		}
	} catch (err) {
		console.error(err);
		if(err.message.match(/key not found/i)){
			try {
				await db.put(key, { 
					token: randomBytes(16).toString('hex')
				});
				console.log(key);

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
}
