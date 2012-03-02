
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
			title: 'Where does your Karma come from?',
			error: null
		});
});

app.get('/about', function(req, res) {
		res.render('about', {
			title: 'About Karma Whoring'
		});
});

app.get('/error', function(req, res) {
		res.render('index', {
			title: 'Where does your Karma come from?',
			error: 'Error connecting to Reddit. Please try again.'
		});
});

app.get('/user/error', function(req, res) {
		res.render('index', {
			title: 'Where does your Karma come from?',
			error: 'Please enter a valid Reddit username.'
		});
});

app.post('/user/',function(req, res) {
	if(req.get('/user/')){
		res.redirect('/user/error/')
	}else{
		var username = req.body.username;
  	 	res.redirect('/user/' + username);
	}
	 
});

app.get('/user/:username', function(req, res) {
	karmaCalculator.getObj(req.params.username, function(error, username, userinfoObject, info){
		if(error){
			res.redirect('/error/')
		}else{
			res.expose(userinfoObject)
			res.render('user_karma.jade',
				{ locals: {
					title: 'Results for ' + username,
					info: info
				}				
			});
		}
	});
});


app.listen(15110);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
