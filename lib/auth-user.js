module.exports = authenticateUser;

/**
	*
	* Authenticate User with Username/Password
	* @param {Object} router - Instance of application router
	* @param {Object} db - Instance of application database
	*
	* */

async function authenticateUser (req, res, { db }) {
	try {
		for await (let buf of req){
			var { username, password } = buf.toString();
			var creds = Buffer.from(`${username}:${password}`).toString('base64');
		}

		var rec = await db.get(`user!${creds}`);
		res.statusCode = 200;
		res.write(JSON.stringify(rec));
		res.end();
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
}

