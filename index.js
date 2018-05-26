require('dotenv').config();

var http = require('http');

var chalk = require('chalk');
var options = require('minimist')(process.argv.slice(2));
var PORT = options.port || 3000;

var router = require('server-router')();
var server = http.createServer(function(req, res){
	var requestLog = `
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

${chalk.yellow(new Date().toISOString().replace(/[A-Z]/g, ' '))} 
${chalk.cyan('REQUEST:')} ${req.method} ${req.url}
${chalk.cyan('ORIGIN:')} ${req.headers.origin} 
${chalk.cyan('USER_AGENT:')} ${req.headers['user-agent']}	

🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
	`;

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	} 	

	console.log(requestLog)
	router.match(req, res)
});

var level = require('level');
var db = level('./api.db', { valueEncoding: 'json' });
var initalizeDatabase = require('./lib/initialize-db')(db);

var authUser = require('./lib/auth-user');
var createUser = require('./lib/create-user');
var getUsers = require('./lib/get-users');
var getAsset = require('./lib/get-asset');
var getAssets = require('./lib/get-assets');
var putAsset = require('./lib/put-asset');
var postAsset = require('./lib/post-asset');

authUser(router, db);
createUser(router, db);
getUsers(router, db);

getAssets(router, db);

getAsset(router, db)
putAsset(router, db);
postAsset(router, db);

router.route('GET', '/*', function (req, res, ctx) {
	res.statusCode = 404;
	res.write(JSON.stringify({ error: 'Content not found' }));
	res.end();
});

server.listen(PORT);

