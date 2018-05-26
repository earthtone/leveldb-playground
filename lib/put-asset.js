module.exports = putRecord;
var concat = require('concat-stream');
var authorizeRequest = require('./auth-request');

function putRecord (router, db){
	router.route('PUT', `${process.env.URL_BASE}/assets/:jobnum`, function (req, res, params){
		authorizeRequest(req, res, db, function(){
			req.pipe(concat({encoding: 'string' }, async function(data, enc){ 
				try {
				 	data = JSON.parse(data);
					var record = await db.get(`asset!${params.jobnum}`);

					if(data.jobnum){
						delete data.jobnum;
					} 

					await db.put(`asset!${params.jobnum}`, {...record, ...data});

					rec = await db.get(`asset!${params.jobnum}`);
					res.statusCode = 200;
					res.write(JSON.stringify(rec, null, 2));
					res.end();
				} catch (err) {
					console.error(err);
					res.statusCode = 500;
					res.write(JSON.stringify({error: 'Internal server error'}));
					res.end();
				}
			}));
		});
	});
}

