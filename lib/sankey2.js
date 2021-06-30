/*!
 * d3.chart.sankey - v0.4.0
 * License: MIT
 * Date: 2017-00-16
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("d3.chart"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "d3.chart"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("d3"), require("d3.chart")) : factory(root["d3"], root["d3"]["chart"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint node: true */

	var Sankey = __webpack_require__(1);

	Sankey.Sankey = Sankey;
	Sankey.Base = __webpack_require__(4);
	Sankey.Selection = __webpack_require__(6);
	Sankey.Path = __webpack_require__(7);

	module.exports = Sankey;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint node: true */

	var d3 = __webpack_require__(2);
	//var sankey = require("d3-plugins-sankey"); // @todo move loader to config and make it work
	var sankey = __webpack_require__(3);
	var Base = __webpack_require__(4);

	module.exports = Base.extend("Sankey", {

		initialize: function() {
			var chart = this;

			chart.d3.sankey = sankey();
			chart.d3.path = chart.d3.sankey.link();
			chart.d3.sankey.size([chart.features.width, chart.features.height]);

			chart.features.spread = false;
			chart.features.iterations = 32;
			chart.features.nodeWidth = chart.d3.sankey.nodeWidth();
			chart.features.nodePadding = chart.d3.sankey.nodePadding();
			chart.features.alignLabel = "auto";

			chart.layers.links = chart.layers.base.append("g").classed("links", true);
			chart.layers.nodes = chart.layers.base.append("g").classed("nodes", true);


			chart.on("change:sizes", function() {
				chart.d3.sankey.nodeWidth(chart.features.nodeWidth);
				chart.d3.sankey.nodePadding(chart.features.nodePadding);
			});

			chart.layer("links", chart.layers.links, {
				dataBind: function(data) {
					return this.selectAll(".link").data(data.links);
				},

				insert: function() {
					return this.append("path").classed("link", true);
				},

				events: {
					"enter": function() {
						this.on("mouseover",  function(e) { chart.trigger("link:mouseover", e); });
						this.on("mouseout",   function(e) { chart.trigger("link:mouseout",  e); });
						this.on("click",      function(e) { chart.trigger("link:click",     e); });
					},

					"merge": function() {
						this
							.attr("d", chart.d3.path)
							.style("stroke", colorLinks)
							.style("stroke-width", function(d) { return Math.max(1, d.dy); })
							.sort(function(a, b) { return b.dy - a.dy; });
					},

					"exit": function() {
						this.remove();
					}
				}
			});

			chart.layer("nodes", chart.layers.nodes, {
				dataBind: function(data) {
					return this.selectAll(".node").data(data.nodes);
				},

				insert: function() {
					return this.append("g").classed("node", true).attr("data-node-id", function(d) {
						return d.id;
					});
				},

				events: {
					"enter": function() {
						this.append("rect");
						this.append("text")
							.attr("dy", ".35em")
							.attr("transform", null);

						this.on("mouseover",  function(e) { chart.trigger("node:mouseover", e); });
						this.on("mouseout",   function(e) { chart.trigger("node:mouseout",  e); });
						this.on("click",      function(e) { chart.trigger("node:click",     e); });
					},

					"merge": function() {
						this.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

						this.select("rect")
							.attr("height", function(d) { return d.dy; })
							.attr("width", chart.features.nodeWidth)
							.style("fill", colorNodes)
							.style("stroke", function(d) { return d3.rgb(colorNodes(d)).darker(2); });

						this.select("text")
							.text(chart.features.name)
							.attr("y", function(d) { return d.dy / 2; })
							.attr("x", function(d) { return textAnchor(d) === "start" ? (6 + chart.features.nodeWidth) : -6; })
							.attr("text-anchor", textAnchor);
					},

					"exit": function() {
						this.remove();
					}
				}
			});

			function textAnchor(node) {
				var align = chart.features.alignLabel;
				if (typeof(align) === "function") {
					align = align(node);
				}
				if (align === "auto") {
					align = node.x < chart.features.width / 2 ? "start" : "end";
				}
				return align;
			}

			function colorNodes(node) {
				if (typeof chart.features.colorNodes === "function") {
					// allow using d3 scales, but also custom function with node as 2nd argument
					return chart.features.colorNodes(chart.features.name(node), node);
				} else {
					return chart.features.colorNodes;
				}
			}

			function colorLinks(link) {
				if (typeof chart.features.colorLinks === "function") {
					// always expect custom function, there"s no sensible default with d3 scales here
					return chart.features.colorLinks(link);
				} else {
					return chart.features.colorLinks;
				}
			}
		},


		transform: function(data) {
			var chart = this;

			chart.data = data;

			chart.d3.sankey
				.nodes(data.nodes)
				.links(data.links)
				.layout(chart.features.iterations);

			if (this.features.spread) {
				this._spreadNodes(data);
				chart.d3.sankey.relayout();
			}

			return data;
		},


		iterations: function(_) {
			if (!arguments.length) { return this.features.iterations; }
			this.features.iterations = _;

			if (this.data) { this.draw(this.data); }

			return this;
		},


		nodeWidth: function(_) {
			if (!arguments.length) { return this.features.nodeWidth; }
			this.features.nodeWidth = _;

			this.trigger("change:sizes");
			if (this.data) { this.draw(this.data); }

			return this;
		},


		nodePadding: function(_) {
			if (!arguments.length) { return this.features.nodePadding; }
			this.features.nodePadding = _;

			this.trigger("change:sizes");
			if (this.data) { this.draw(this.data); }

			return this;
		},


		spread: function(_) {
			if (!arguments.length) { return this.features.spread; }
			this.features.spread = _;

			if (this.data) { this.draw(this.data); }

			return this;
		},



		alignLabel: function(_) {
			if (!arguments.length) { return this.features.alignLabel; }
			this.features.alignLabel = _;

			if (this.data) { this.draw(this.data); }

			return this;
		},


		_spreadNodes: function(data) {
			var chart = this,
					nodesByBreadth = d3.nest()
					.key(function(d) { return d.x; })
					.entries(data.nodes)
					.map(function(d) { return d.values; });

			nodesByBreadth.forEach(function(nodes) {
				var i,
						node,
						sum = d3.sum(nodes, function(o) { return o.dy; }),
						padding = (chart.features.height - sum) / nodes.length,
						y0 = 0;
				nodes.sort(function(a, b) { return a.y - b.y; });
				for (i = 0; i < nodes.length; ++i) {
					node = nodes[i];
					node.y = y0;
					y0 += node.dy + padding;
				}
			});
		}

	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var d3 = __webpack_require__(2);

	d3.sankey = function() {
	  var sankey = {},
	      nodeWidth = 24,
	      nodePadding = 8,
	      size = [1, 1],
	      nodes = [],
	      links = [];

	  sankey.nodeWidth = function(_) {
	    if (!arguments.length) return nodeWidth;
	    nodeWidth = +_;
	    return sankey;
	  };

	  sankey.nodePadding = function(_) {
	    if (!arguments.length) return nodePadding;
	    nodePadding = +_;
	    return sankey;
	  };

	  sankey.nodes = function(_) {
	    if (!arguments.length) return nodes;
	    nodes = _;
	    return sankey;
	  };

	  sankey.links = function(_) {
	    if (!arguments.length) return links;
	    links = _;
	    return sankey;
	  };

	  sankey.size = function(_) {
	    if (!arguments.length) return size;
	    size = _;
	    return sankey;
	  };

	  sankey.layout = function(iterations) {
	    computeNodeLinks();
	    computeNodeValues();
	    computeNodeBreadths();
	    computeNodeDepths(iterations);
	    computeLinkDepths();
	    return sankey;
	  };

	  sankey.relayout = function() {
	    computeLinkDepths();
	    return sankey;
	  };

	  sankey.link = function() {
	    var curvature = .5;

	    function link(d) {
	      var x0 = d.source.x + d.source.dx,
	          x1 = d.target.x,
	          xi = d3.interpolateNumber(x0, x1),
	          x2 = xi(curvature),
	          x3 = xi(1 - curvature),
	          y0 = d.source.y + d.sy + d.dy / 2,
	          y1 = d.target.y + d.ty + d.dy / 2;
	      return "M" + x0 + "," + y0
	           + "C" + x2 + "," + y0
	           + " " + x3 + "," + y1
	           + " " + x1 + "," + y1;
	    }

	    link.curvature = function(_) {
	      if (!arguments.length) return curvature;
	      curvature = +_;
	      return link;
	    };

	    return link;
	  };

	  // Populate the sourceLinks and targetLinks for each node.
	  // Also, if the source and target are not objects, assume they are indices.
	  function computeNodeLinks() {
	    nodes.forEach(function(node) {
	      node.sourceLinks = [];
	      node.targetLinks = [];
	    });
	    links.forEach(function(link) {
	      var source = link.source,
	          target = link.target;
	      if (typeof source === "number") source = link.source = nodes[link.source];
	      if (typeof target === "number") target = link.target = nodes[link.target];
	      source.sourceLinks.push(link);
	      target.targetLinks.push(link);
	    });
	  }

	  // Compute the value (size) of each node by summing the associated links.
	  function computeNodeValues() {
	    nodes.forEach(function(node) {
	      node.value = Math.max(
	        d3.sum(node.sourceLinks, value),
	        d3.sum(node.targetLinks, value)
	      );
	    });
	  }

	  // Iteratively assign the breadth (x-position) for each node.
	  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
	  // nodes with no incoming links are assigned breadth zero, while
	  // nodes with no outgoing links are assigned the maximum breadth.
	  function computeNodeBreadths() {
	    var remainingNodes = nodes,
	        nextNodes,
	        x = 0;

      while (remainingNodes.length && x < nodes.length) {
	      nextNodes = [];
	      remainingNodes.forEach(function(node) {
	        node.x = x;
	        node.dx = nodeWidth;
	        node.sourceLinks.forEach(function(link) {
	          nextNodes.push(link.target);
	        });
	      });
	      remainingNodes = nextNodes;
	      ++x;
	    }

	    //
	    moveSinksRight(x);
	    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
	  }

	  function moveSourcesRight() {
	    nodes.forEach(function(node) {
	      if (!node.targetLinks.length) {
	        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
	      }
	    });
	  }

	  function moveSinksRight(x) {
	    nodes.forEach(function(node) {
	      if (!node.sourceLinks.length) {
	        node.x = x - 1;
	      }
	    });
	  }

	  function scaleNodeBreadths(kx) {
	    nodes.forEach(function(node) {
	      node.x *= kx;
	    });
	  }

	  function computeNodeDepths(iterations) {
	    var nodesByBreadth = d3.nest()
	        .key(function(d) { return d.x; })
	        .sortKeys(d3.ascending)
	        .entries(nodes)
	        .map(function(d) { return d.values; });

	    //
	    initializeNodeDepth();
	    resolveCollisions();
	    for (var alpha = 1; iterations > 0; --iterations) {
	      relaxRightToLeft(alpha *= .99);
	      resolveCollisions();
	      relaxLeftToRight(alpha);
	      resolveCollisions();
	    }

	    function initializeNodeDepth() {
	      var ky = d3.min(nodesByBreadth, function(nodes) {
	        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
	      });

	      nodesByBreadth.forEach(function(nodes) {
	        nodes.forEach(function(node, i) {
	          node.y = i;
	          node.dy = node.value * ky;
	        });
	      });

	      links.forEach(function(link) {
	        link.dy = link.value * ky;
	      });
	    }

	    function relaxLeftToRight(alpha) {
	      nodesByBreadth.forEach(function(nodes, breadth) {
	        nodes.forEach(function(node) {
	          if (node.targetLinks.length) {
	            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
	            node.y += (y - center(node)) * alpha;
	          }
	        });
	      });

	      function weightedSource(link) {
	        return center(link.source) * link.value;
	      }
	    }

	    function relaxRightToLeft(alpha) {
	      nodesByBreadth.slice().reverse().forEach(function(nodes) {
	        nodes.forEach(function(node) {
	          if (node.sourceLinks.length) {
	            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
	            node.y += (y - center(node)) * alpha;
	          }
	        });
	      });

	      function weightedTarget(link) {
	        return center(link.target) * link.value;
	      }
	    }

	    function resolveCollisions() {
	      nodesByBreadth.forEach(function(nodes) {
	        var node,
	            dy,
	            y0 = 0,
	            n = nodes.length,
	            i;

	        // Push any overlapping nodes down.
	        nodes.sort(ascendingDepth);
	        for (i = 0; i < n; ++i) {
	          node = nodes[i];
	          dy = y0 - node.y;
	          if (dy > 0) node.y += dy;
	          y0 = node.y + node.dy + nodePadding;
	        }

	        // If the bottommost node goes outside the bounds, push it back up.
	        dy = y0 - nodePadding - size[1];
	        if (dy > 0) {
	          y0 = node.y -= dy;

	          // Push any overlapping nodes back up.
	          for (i = n - 2; i >= 0; --i) {
	            node = nodes[i];
	            dy = node.y + node.dy + nodePadding - y0;
	            if (dy > 0) node.y -= dy;
	            y0 = node.y;
	          }
	        }
	      });
	    }

	    function ascendingDepth(a, b) {
	      return a.y - b.y;
	    }
	  }

	  function computeLinkDepths() {
	    nodes.forEach(function(node) {
	      node.sourceLinks.sort(ascendingTargetDepth);
	      node.targetLinks.sort(ascendingSourceDepth);
	    });
	    nodes.forEach(function(node) {
	      var sy = 0, ty = 0;
	      node.sourceLinks.forEach(function(link) {
	        link.sy = sy;
	        sy += link.dy;
	      });
	      node.targetLinks.forEach(function(link) {
	        link.ty = ty;
	        ty += link.dy;
	      });
	    });

	    function ascendingSourceDepth(a, b) {
	      return a.source.y - b.source.y;
	    }

	    function ascendingTargetDepth(a, b) {
	      return a.target.y - b.target.y;
	    }
	  }

	  function center(node) {
	    return node.y + node.dy / 2;
	  }

	  function value(link) {
	    return link.value;
	  }

	  return sankey;
	};

	/*** EXPORTS FROM exports-loader ***/
	module.exports = d3.sankey;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint node: true */

	var d3 = __webpack_require__(2);
	var Chart = __webpack_require__(5);

	/*jshint newcap: false */
	module.exports = Chart("Sankey.Base", {

		initialize: function() {
			var chart = this;

			// Inspired by d3.chart.layout.hierarchy's hierarchy.js, though also different
			chart.features	= {};
			chart.d3				= {};
			chart.layers		= {};

			// when using faux-dom, be sure to set the width and height attributes
			if (!chart.base.attr("width"))	{ chart.base.attr("width",	chart.base.node().parentNode.clientWidth);	}
			if (!chart.base.attr("height")) { chart.base.attr("height", chart.base.node().parentNode.clientHeight); }

			// dimensions, with space for node stroke and labels (smallest at bottom)
			chart.features.margins  = {top: 1, right: 1, bottom: 6, left: 1};
			chart.features.width    = chart.base.attr("width") - chart.features.margins.left - chart.features.margins.right;
			chart.features.height   = chart.base.attr("height") - chart.features.margins.top - chart.features.margins.bottom;

			chart.features.name     = function(d) { return d.name; };
			// there is no value property, because we also need to set it on parents
			chart.features.colorNodes = d3.scale.category20c();
			chart.features.colorLinks = null; // css styles by default

			chart.layers.base = chart.base.append("g")
				.attr("transform", "translate(" + chart.features.margins.left + "," + chart.features.margins.top + ")");
		},


		name: function(_) {
			if (!arguments.length) { return this.features.name; }
			this.features.name = _;

			this.trigger("change:name");
			if (this.root) { this.draw(this.root); }

			return this;
		},


		colorNodes: function(_) {
			if (!arguments.length) { return this.features.colorNodes; }
			this.features.colorNodes = _;

			this.trigger("change:color");
			if (this.root) { this.draw(this.root); }

			return this;
		},


		colorLinks: function(_) {
			if (!arguments.length) { return this.features.colorLinks; }
			this.features.colorLinks = _;

			this.trigger("change:color");
			if (this.data) { this.draw(this.data); }

			return this;
		}

	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint node: true */

	var Sankey = __webpack_require__(1);

	// Sankey diagram with a hoverable selection
	module.exports = Sankey.extend("Sankey.Selection", {

		initialize: function() {
			var chart = this;

			chart.features.selection = null;
			chart.features.unselectedOpacity = 0.2;

			chart.on("link:mouseover", chart.selection);
			chart.on("link:mouseout", function() { chart.selection(null); });
			chart.on("node:mouseover", chart.selection);
			chart.on("node:mouseout", function() { chart.selection(null); });

			// going through the whole draw cycle can be a little slow, so we use
			// a selection changed event to update existing nodes directly
			chart.on("change:selection", updateTransition);
			this.layer("links").on("enter", update);
			this.layer("nodes").on("enter", update);

			function update() {
				/*jshint validthis:true */
				if (chart.features.selection && chart.features.selection.length) {
					return this.style("opacity", function(o) {
						return chart.features.selection.indexOf(o) >= 0 ? 1 : chart.features.unselectedOpacity;
					});
				} else {
					return this.style("opacity", 1);
				}
			}

			function updateTransition() {
				var transition = chart.layers.base.selectAll(".node, .link").transition();
				if (!chart.features.selection || !chart.features.selection.length) {
					// short delay for the deselect transition to avoid flicker
					transition = transition.delay(100);
				}
				update.apply(transition.duration(50));
			}
		},

		selection: function(_) {
			if (!arguments.length) { return this.features.selection; }
			this.features.selection = (!_ || _ instanceof Array) ? _ : [_];

			this.trigger("change:selection");

			return this;
		},

		unselectedOpacity: function(_) {
			if (!arguments.length) { return this.features.unselectedOpacity; }
			this.features.unselectedOpacity = _;

			this.trigger("change:selection");

			return this;
		}

	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint node: true */

	var Selection = __webpack_require__(6);

	// Sankey diagram with a path-hover effect
	module.exports = Selection.extend("Sankey.Path", {

		selection: function(_) {
			var chart = this;

			if (!arguments.length) { return chart.features.selection; }
			chart.features.selection = (!_ || _ instanceof Array) ? _ : [_];

			// expand selection with connections
			if (chart.features.selection) {
				chart.features.selection.forEach(function(o) {
					getConnections(o).forEach(function(p) {
						chart.features.selection.push(p);
					});
				});
			}

			chart.trigger("change:selection");

			return chart;
		}

	});

	function getConnections(o, direction) {
		if (o.source && o.target) {
			return getConnectionsLink(o, direction);
		} else {
			return getConnectionsNode(o, direction);
		}
	}

	// Return the link and its connected nodes with their links etc.
	function getConnectionsLink(o, direction) {
		var links = [o];
		direction = direction || "both";

		if (direction == "source" || direction == "both") {
			links = links.concat(getConnectionsNode(o.source, "source"));
		}
		if (direction == "target" || direction == "both") {
			links = links.concat(getConnectionsNode(o.target, "target"));
		}

		return links;
	}

	// Return the node and its connected links. If direction is "both", just return
	// all links; if direction is "source", only return the source link when there
	// is one target link (or none, in which case the node is an endnode); if
	// direction is "target" vice versa. Open the product example to see why.
	function getConnectionsNode(o, direction) {
		var links = [o];
		direction = direction || "both";

		if ((direction == "source" && o.sourceLinks.length < 2) || direction == "both") {
			o.targetLinks.forEach(function(p) { links = links.concat(getConnectionsLink(p, direction)); });
		}
		if ((direction == "target" && o.targetLinks.length < 2) || direction == "both") {
			o.sourceLinks.forEach(function(p) { links = links.concat(getConnectionsLink(p, direction)); });
		}

		return links;
	}


/***/ }
/******/ ])
});
;
