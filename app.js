
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();
var http = require('http')
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
		res.render('index', {
			title: 'Are you a Karma whore?'
		});
});

app.get('/test', function(req, res) {
		res.render('test', {
			title: 'Are you a Karma whore?'
		});
});

app.post('/user/',function(req, res) {
	 var username = req.body.username;
  	 res.redirect('/user/' + username);
});

app.get('/user/:username', function(req, res) {
	

	var maxChildren = 100; //limits number of api requests (25/request)
	var username = req.params.username;
	var userinfo = [];
	var newpage = 0;
	var count = 0;
	var after;
	console.log("check1")
	var bigloop = function(count, after){
		
		//set params
		if (count != 0){var params = "?count=" + count + "&after=" + after;}else{params = ""}
		

		var options = {
			host: 'www.reddit.com',
			port: 80,
			path: '/user/' + username + '.json' + params,
			method: 'GET'
		};
		console.log(options)

		var req = http.request(options, function(resp) {
			//console.log('STATUS: ' + resp.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(resp.headers));
			resp.setEncoding('utf8');
			
			resp.on('data', function (chunk) {
				//console.log('BODY: ' + chunk);
				if (newpage == 0) {
					newpage = chunk;
				}
				else{
					newpage += chunk;	
				};
			}).addListener("end", function() {
				console.log("all finished here");
				newpage = JSON.parse(newpage)
				if(newpage.data){
					userinfo = userinfo.concat(newpage.data.children);
					//console.log(userinfo);
					if(!newpage.data.after || count >= (maxChildren - 25)){
						res.render('user_karma.jade',
							{ locals: {
								title: username,
								info: userinfo
							}
						});
					}else{
						count += 25;
						after = newpage.data.after;
						newpage = 0;
						bigloop(count, after);
					}
				}else{
					res.redirect('/error/');
				}
			})
		});

		req.end();
	}

	bigloop(count, after);
});

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
