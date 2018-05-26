require('dotenv').config();

var http = require('http');
var options = require('minimist')(process.argv.slice(2));
var PORT = options.port || 3000;

var logRequestMessage = require('./lib/log-request-message');
var router = require('server-router')();
var server = http.createServer(function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	} 	

	console.log(logRequestMessage(req));
	router.match(req, res)
});

var level = require('level');
var db = level('./api.db', { valueEncoding: 'json' });
var initalizeDatabase = require('./lib/initialize-db')(db, options);

var authUser = require('./lib/auth-user');
var createUser = require('./lib/create-user');
var getUsers = require('./lib/get-users');
var getAsset = require('./lib/get-asset');
var getAssets = require('./lib/get-assets');

router.route('POST', '/user/auth', function(req, res, ctx){
	authUser(req, res, { db, ...ctx});
});

router.route('POST', 'user/create', function(req, res, ctx){
	createUser(req, res, { db, ...ctx });
});

router.route('GET', '/assets', function(req, res, ctx) {
	getAssets(req, res, { db, ...ctx });
});

router.route('GET', '/assets/:id', function(req, res, ctx) {
	getAsset(req, res, { db, ...ctx })
});

router.route('GET', '/*', function (req, res, ctx) {
	res.statusCode = 404;
	res.write(JSON.stringify({ error: 'Content not found' }));
	res.end();
});

server.listen(PORT, function(err){
	if(err) console.error('🚨🚨🚨', err);
	console.log(`✨ Listening on ${PORT} ✨`);	
});
