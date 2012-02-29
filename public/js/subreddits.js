var subreddits = {};
var userinfoObject = {"children": []};
var links = 0;
var linkVotes = 0;
var comments = 0;
var commentVotes = 0;
for (child in info) {
	var votes = (child.data.ups - child.data.downs);
	if (subreddits[child.data.subreddit]) {
		subreddits[child.data.subreddit] += votes;
	}
	else {
		subreddits[child.data.subreddit] = votes;
	}
	if (child.kind == 't3') {
		links += 1;
		linkVotes += votes;
	}	 
	else {
		comments += 1;
		commentVotes += votes;
	}		 
}
for (votes, subreddit in subreddits) {
 	userinfoObject.children.push({"name":subreddit,"size":votes});
}
	
console.log(userinfoObject)