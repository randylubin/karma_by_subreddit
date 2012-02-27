
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

app.get('/user/:username', function(req, res) {
	
	var username = req.params.username;
	var userinfo;

	var options = {
		host: 'www.reddit.com',
		port: 80,
		path: '/user/' + username + '.json',
		method: 'GET'
	};
	console.log(options)

	var req = http.request(options, function(resp) {
		//console.log('STATUS: ' + resp.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(resp.headers));
		resp.setEncoding('utf8');
		
		resp.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
			if (userinfo == undefined) {
				userinfo = chunk;
			}
			else{
				userinfo += chunk;	
			};
		}).addListener("end", function() {
			console.log("all finished here");
			userinfo = JSON.parse(userinfo)
			//console.log(userinfo);
			if(!userinfo.data.after){
				res.render('user_karma.jade',
					{ locals: {
						title: username,
						info: userinfo.data
					}
				});
			}else{
				
				res.render('user_karma.jade',
					{ locals: {
						title: username,
						info: userinfo.data
					}
				});
			}
		})
	});

	req.end();
	
});

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
