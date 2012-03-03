$(document).ready(function() { 
	var r = 480,
	    format = d3.format(",d"),
	    fill = d3.scale.category20();

	var bubble = d3.layout.pack()
	    .sort(d3.descending)
	    .size([r, r]);

	var vis = d3.select("#chart").append("svg")
	    .attr("width", r)
	    .attr("height", r)
	    .attr("class", "bubble");
	
	var minRadius = 30;   

	var runJSON = function(userinfoObject) {
	  var node = vis.selectAll("g.node")
	      .data(bubble.nodes(classes(userinfoObject))
	      .filter(function(d) { return !d.children; }))
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  node.append("title")
	      .text(function(d) { return d.value; });

	  node.append("circle")
	      .attr("r", function(d) { return d.r; })
	      .attr("name", function(d) { return d.className; })
	      .attr("size",function(d) { return d.value; })
	      .style("fill", function(d) { return fill(d.value); })
	      //.style("overflow", "hidden")
	      .on("mouseover", animateFirstStep)
          .on("mouseout", animateSecondStep);

		  node.append("text")
		      .attr("text-anchor", "middle")
		      .attr("y", ".3em")
		      .style("cursor", "default")
		      .text(function(d) { return d.className; });

		  /*
		  node.append("text")
		      .attr("text-anchor", "middle")
		      .attr("y", "15px")	      
		      //.style("overflow", "hidden")
		      .style("cursor", "default")
		      .text(function(d) { return Math.round(d.value); });
			*/
// Here is where the text is hidden for small circles

		       $('circle')  //get all circles
		       		.filter(function(index){  //start filtering
		       			return $(this).attr('r') < minRadius; // by radius size      
		       		})   // if small enough, continue
		       		.parent()   //get parent node
		       		.children('text')  //get related text
		       		.hide(); //hide them
		      

	};

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	//Hover animation methods
	

	function animateFirstStep(){
		name = $(this).attr('name')
		size = $(this).attr('size')
		$("#titleprompt").hide();
		d3.select('#title').append("div")
			.attr("id", "text")
			.attr("height", "50px")
			.text(name + ' has '+ size + ' votes.').style("font-size", "24px");
			//action for big bubbles
	
	};

	function animateSecondStep(){
    	d3.select("#text").remove();
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


