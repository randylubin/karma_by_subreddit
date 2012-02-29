
/**
 * Module dependencies.
 */

var express = require('express')
  , expose = require('express-expose')
  , routes = require('./routes')

var KarmaProvider = require('./karmaCalculator').KarmaCalculator;

var app = module.exports = express.createServer();

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
var karmaCalculator = new KarmaCalculator;

app.get('/', function(req, res) {
		res.render('index', {
			title: 'Are you a Karma whore?'
		});
});

app.get('/test', function(req, res) {
		res.expose('karmaObj = 	{		"children": [		   			{"name": "AgglomerativeCluster", "size": 3938},			{"name": "CommunityStructure", "size": 3812},			{"name": "HierarchicalCluster", "size": 6714},			{"name": "MergeEdge", "size": 743}		]	}')
		res.render('test', {
			title: 'Are you a Karma whore?'
		});
});

app.post('/user/',function(req, res) {
	 var username = req.body.username;
  	 res.redirect('/user/' + username);
});

app.get('/user/:username', function(req, res) {
	karmaCalculator.getObj(req.params.username, function(error, username, userinfoObject, info){
		res.expose(userinfoObject)
		res.render('user_karma.jade',
			{ locals: {
				title: username,
				info: info
			}				
		});
	});
});


app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
