$(document).ready(function() { 
	var dataset = subreddits;
	console.log(d3.keys(dataset))
	d3.select("#viz").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
 	.style("height", function(d) {
    	var barHeight = d * 5;  //Scale up by factor of 5
    	return barHeight + "px";
	});

 	//bubble data
	/*var userinfoObject = 
		{
			"children": [
			
			   
			      {"name": "AgglomerativeCluster", "size": 3938},
			      {"name": "CommunityStructure", "size": 3812},
			      {"name": "HierarchicalCluster", "size": 6714},
			      {"name": "MergeEdge", "size": 743}
			     
			    
				
			]
		}
	*/
 	//bubble chart
/*
	var r = 960,
	    format = d3.format(",d"),
	    fill = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([r, r]);

	var vis = d3.select("#chart").append("svg")
	    .attr("width", r)
	    .attr("height", r)
	    .attr("class", "bubble");

	var runJSON = function(userinfoObject) {
		console.log("running");
	  var node = vis.selectAll("g.node")
	      .data(bubble.nodes(classes(userinfoObject))
	      .filter(function(d) { return !d.children; }))
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  node.append("title")
	      .text(function(d) { return d.className + ": " + format(d.value); });

	  node.append("circle")
	      .attr("r", function(d) { return d.r; })
	      .style("fill", function(d) { return fill(d.packageName); });

	  node.append("text")
	      .attr("text-anchor", "middle")
	      .attr("dy", ".3em")
	      .text(function(d) { return d.className.substring(0, d.r / 3); });
	};

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	function classes(root) {
	  var classes = [];

	  function recurse(name, node) {
	    if (node.children){
	    	node.children.forEach(function(child) { recurse(node.name, child); });
	    }
	    else classes.push({packageName: name, className: node.name, value: node.size});
	  }

	  recurse(null, root);
	  return {children: classes};
	}
	*/
});

