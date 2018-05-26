module.exports = postRecord;
var concat = require('concat-stream');
var authorizeRequest = require('./auth-request');

var proto = {
	jobnum: null,
	provider_name: null,
	joint_providership: null,
	pharmacy_activity_type: null,
	title: null,
	acpecred: null,
	target_audience: null,
	home_study_format: null,
	keywords: null,
	learnobj: null,
	reldate: null,
	termdate: null,
	uan: null
};

function postRecord (router, db){
	router.route('POST', `${process.env.URL_BASE}/assets/:jobnum`, function (req, res, params){
		authorizeRequest(req, res, db, function(){
			req.pipe(concat({encoding: 'string' }, async function(data, enc){ 
				try {
					data = JSON.parse(data);
					if(!data.jobnum || data.jobnum === 'null' || params.jobnum !== data.jobnum){
						throw new Error('Invalid record key');	
					} else if (!data.title) {
						throw new Error('Invalid record title');
					}

					data = Object.assign(proto, data);
					await db.put(`asset!${params.jobnum}`, data);

					var rec = await db.get(`asset!${params.jobnum}`);
					res.statusCode = 200;
					res.write(JSON.stringify(rec, null, 2));
					res.end();
				} catch (err) {
					console.error(`${req.method} ${req.url}\n`, err);
					if(err.message.match(/invalid record/i)){
						res.statusCode = 400;
						res.write(JSON.stringify({error: err.message}));
						res.end();
					}	else {
						res.statusCode = 500;
						res.write(JSON.stringify({error: 'Internal server error'}));
						res.end();
					}
				}
			}));
		});
	});
}

