$(document).ready(function() { 
	var r = 480,
	    format = d3.format(",d"),
	    fill = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(d3.descending)
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
	      .style("fill", function(d) { return fill(d.value); })
	      .style("overflow", "hidden")
	      .on("mouseover", animateFirstStep)
          .on("mouseout", animateSecondStep);
	      

	  node.append("text")
	      .attr("text-anchor", "middle")
	      .attr("y", ".3em")
	      .style("class", "body")
	      .text(function(d) { return d.className.substring(0, d.r / 3); });

	  node.append("text")
	      .attr("text-anchor", "middle")
	      .attr("y", "15px")	      
	      .attr("overflow", "hidden")
	      .text(function(d) { return Math.round(d.value); });    

	};

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	//Hover animation methods
	function animateFirstStep(){
    	d3.select(this)
      	.transition()            
        .delay(0)            
        .duration(1000)
        .style("z-index", "999")
        .attr("r", function(d){return d.r*2;});

};

	function animateSecondStep(){
    	d3.select(this)
      	.transition()            
        .delay(0)            
        .duration(1000)
        .attr("r", function(d){return d.r;});
};

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
	runJSON(karmaObj);

});

