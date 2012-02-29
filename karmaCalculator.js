var http = require('http')

KarmaCalculator = function(){};

KarmaCalculator.prototype.getObj = function(username, callback){
	var maxChildren = 100; //limits number of api requests (25/request)
	var userinfo = [];
	var newpage = 0;
	var count = 0;
	var after;

	bigloop = function(count, after){
		
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
			console.log('STATUS: ' + resp.statusCode);
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
						karmaObj = transformKarma(userinfo);
						callback(null, username, karmaObj, userinfo);
					}else{
						count += 25;
						after = newpage.data.after;
						newpage = 0;
						bigloop(count, after);
					}
				}else{
					error = 'username does not exist'
					callback(error)
				}
			})
		});

		req.end();
	}

	bigloop(count, after);
}

function transformKarma(userinfo){
	var subreddits = {};
	var karmaObj = {"children":[]};
	var links = 0;
	var linkVotes = 0;
	var comments = 0;
	var commentVotes = 0;
	//console.log(userinfo)
	for (i in userinfo){
		var child = userinfo[i];
		var ups = child.data.ups || 0;
		var downs = child.data.downs || 0;
		var votes = (ups-downs);
		if (votes<=0) votes = .1;
		if (subreddits[child.data.subreddit]){
			subreddits[child.data.subreddit] += votes;
		}else{
			subreddits[child.data.subreddit] = votes;
		}

		if (child.kind == 't3'){
			links += 1;
			linkVotes += votes;
		}else{
			comments += 1;
			commentVotes += votes;
		}
		
	}
	
	for (subreddit in subreddits){
		karmaObj.children.push({"name":subreddit,"size":subreddits[subreddit]})
	}
	var tempString = JSON.stringify(karmaObj);
	karmaObj = 'var karmaObj = ' + tempString;
	console.log(karmaObj)
	return karmaObj
}

exports.KarmaCalculator = KarmaCalculator;
