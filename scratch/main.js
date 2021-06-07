/*//////////////////////////////////////////////////////////
////////////////// Set up the Data /////////////////////////
//////////////////////////////////////////////////////////*/

var idxMap = {
77: 0,
69: 1,
42: 2
}

var locations = [
  { id: 0, name: "xDai", color: "#FFFF00" },
  { id: 1, name: "Optimism", color: "#ff0000" },
  //{ id: 80001, name: "Polygon", color: "#6a0dad" },
  { id: 2, name: "Ethereum", color: "#0000FF" },
/*
  { id: 3, name: "Gate E", color: "#064010" },
  { id: 4, name: "Check-in 1", color: "#F4CF11" },
  { id: 5, name: "Check-in 2", color: "#B3970C" },
  { id: 6, name: "Check-in 3", color: "#665607" },
  { id: 7, name: "Airside Center", color: "#0D6180" },
  { id: 8, name: "Airport Shopping", color: "#16A2D5" },
  { id: 9, name: "P1", color: "#01FAF1" },
  { id: 10, name: "P2", color: "#14CCCC" },
  { id: 11, name: "P3", color: "#0F9999" },
  { id: 12, name: "P4", color: "#0C8080" },
  { id: 13, name: "P5", color: "#074D4D" },
  { id: 14, name: "Rail", color: "#F27900" },
  { id: 15, name: "Bus/Tram", color: "#EF4F00" }
*/
];

var flows = [
  { from: 42, to: 42, quantity: 0},
  { from: 42, to: 77, quantity: 0},
  { from: 42, to: 69, quantity: 0},
  { from: 69, to: 42, quantity: 0},
  { from: 69, to: 77, quantity: 0},
  { from: 69, to: 69, quantity: 0},
  { from: 77, to: 42, quantity: 0},
  { from: 77, to: 77, quantity: 0},
  { from: 77, to: 69, quantity: 0},
]
var f = []
var counts = {}

for (let d of data) {
  if (!counts[d.sourceChain]) {
    counts[d.sourceChain] = {}
  }
  if (!counts[d.sourceChain][d.destinationChain]) {
    counts[d.sourceChain][d.destinationChain] = 0
  }
  counts[d.sourceChain][d.destinationChain] += 1
}
console.log(counts)

for (let k in counts) {
  for (let q in counts[k]) {
    let obj = flows.find(x => x.from === Number(k) && x.to === Number(q))
    obj.quantity = counts[k][q]
  }
}

flows = flows.map(flow => {
  flow.from = idxMap[flow.from]
  flow.to = idxMap[flow.to]
  return flow
})

/*
[
  { from: 0, to: 0, quantity: 0},
  { from: 0, to: 1, quantity: 1 },
  { from: 0, to: 1, quantity: 1 },
  { from: 0, to: 2, quantity: 1 },
  { from: 0, to: 2, quantity: 1 },
  { from: 0, to: 2, quantity: 1 },
  { from: 0, to: 3, quantity: 1 },
  { from: 1, to: 0, quantity: 1},
  { from: 1, to: 1, quantity: 0 },
  { from: 1, to: 2, quantity: 1 },
  { from: 1, to: 3, quantity: 1 },
  { from: 2, to: 0, quantity: 1 },
  { from: 2, to: 1, quantity: 1 },
  { from: 2, to: 2, quantity: 0 },
  { from: 2, to: 3, quantity: 1 },
  { from: 3, to: 0, quantity: 1},
  { from: 3, to: 1, quantity: 1 },
  { from: 3, to: 2, quantity: 1 },
  { from: 3, to: 3, quantity: 0 },
];
*/

var totalCount = 0;
var matrix = [];

//Map list of data to matrix
flows.forEach(function (flow) {
  if (!matrix[flow.from]) {
    matrix[flow.from] = [];
  }
  matrix[flow.from][flow.to] = flow.quantity;
  totalCount += flow.quantity;
});

/*//////////////////////////////////////////////////////////
/////////////// Initiate Chord Diagram /////////////////////
//////////////////////////////////////////////////////////*/
var size = 1000;
var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var innerRadius = Math.min(width, height) * .39;
var outerRadius = innerRadius * 1.08;
var focusedChordGroupIndex = null;

/*Initiate the SVG*/
//D3.js v3!
var svg = d3.select("#chart").append("svg:svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("svg:g")
.attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

var chord = customChordLayout() //Using custom chord layout to order chords by adjacency so that they don't cross.
.padding(0.02)
.sortChords(d3.ascending) /*which chord should be shown on top when chords cross. Now the biggest chord is at the top*/
.matrix(matrix);

/*//////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
//////////////////////////////////////////////////////////*/
var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius);

var g = svg.selectAll("g.group")
.data(chord.groups)
.enter().append("svg:g")
.attr("class", function (d) { return "group " + locations[d.index].id; });

g.append("svg:path")
  .attr("class", "arc")
  .style("stroke", function (d) { return d3.rgb(locations[d.index].color).brighter(); })
  .style("fill", function (d) { return locations[d.index].color; })
  .attr("d", arc)
  .on("click", function (d) { highlightChords(d.index) });

/*//////////////////////////////////////////////////////////
////////////////// Initiate Ticks //////////////////////////
//////////////////////////////////////////////////////////*/
var ticks = svg.selectAll("g.group").append("svg:g")
.attr("class", function (d) { return "ticks " + locations[d.index].id; })
.selectAll("g.ticks")
.attr("class", "ticks")
.data(groupTicks)
.enter().append("svg:g")
.attr("transform", function (d) {
  return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    + "translate(" + outerRadius + 40 + ",0)";
});

/*Append the tick around the arcs*/
ticks.append("svg:line")
  .attr("x1", 1)
  .attr("y1", 0)
  .attr("x2", 8)
  .attr("y2", 0)
  .attr("class", "ticks")
  .style("stroke", "#FFF")
  .style("stroke-width", "1.5px");

/*Add the labels for the %'s*/
ticks.append("svg:text")
  .attr("x", 8)
  .attr("dy", ".35em")
  .attr("class", "tickLabels")
  .style("font-size", "10px")
  .style("font-family", "sans-serif")
  .attr("fill", "#FFF")
  .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
  .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
  .text(function (d) { return d.label; });

/*//////////////////////////////////////////////////////////
////////////////// Initiate Names //////////////////////////
//////////////////////////////////////////////////////////*/
g.append("svg:text")
  .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
  .attr("dy", ".35em")
  .attr("class", "titles")
  .style("font-size", "14px")
  .style("font-family", "sans-serif")
  .attr("fill", "#FFF")
  .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function (d) {
  return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    + "translate(" + (innerRadius + 55) + ")"
    + (d.angle > Math.PI ? "rotate(180)" : "");
})
  .text(function (d, i) { return locations[i].name; });

/*//////////////////////////////////////////////////////////
//////////////// Initiate inner chords /////////////////////
//////////////////////////////////////////////////////////*/
var chords = svg.selectAll("path.chord")
.data(chord.chords)
.enter().append("svg:path")
.attr("class", "chord")
.attr("class", function (d) {
  return "chord chord-source-" + d.source.index + " chord-target-" + d.target.index;
})
.style("fill-opacity", "0.7")
.style("stroke-opacity", "1")
//.style("stroke-width", "10px")
//Change the fill to reference the unique gradient ID
//of the source-target combination
.style("fill", function (d) {
  return "url(#chordGradient-" + d.source.index + "-" + d.target.index + ")";
})
.style("stroke", function (d) {
  return "url(#chordGradient-" + d.source.index + "-" + d.target.index + ")";
})
//.style("stroke", function (d) { return d3.rgb(locations[d.source.index].color).brighter(); })
//.style("fill", function (d) { return locations[d.source.index].color; })
.attr("d", customChordPathGenerator().radius(innerRadius))
.on("click", function () { showAllChords() });

//Cf https://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram
//Create a gradient definition for each chord
var grads = svg.append("defs").selectAll("linearGradient")
.data(chord.chords)
.enter().append("linearGradient")
//Create a unique gradient id per chord: e.g. "chordGradient-0-4"
.attr("id", function (d) {
  return "chordGradient-" + d.source.index + "-" + d.target.index;
})
//Instead of the object bounding box, use the entire SVG for setting locations
//in pixel locations instead of percentages (which is more typical)
.attr("gradientUnits", "userSpaceOnUse")
//The full mathematical formula to find the x and y locations
.attr("x1", function (d, i) {
  return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 +
                                d.source.startAngle - Math.PI / 2);
})
.attr("y1", function (d, i) {
  return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 +
                                d.source.startAngle - Math.PI / 2);
})
.attr("x2", function (d, i) {
  return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 +
                                d.target.startAngle - Math.PI / 2);
})
.attr("y2", function (d, i) {
  return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 +
                                d.target.startAngle - Math.PI / 2);
});

//Set the starting color (at 0%)
grads.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", function (d) { return locations[d.source.index].color; });

//Set the ending color (at 100%)
grads.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", function (d) { return locations[d.target.index].color; });

/*//////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
//////////////////////////////////////////////////////////*/

/*Returns an array of tick angles and labels, given a group*/
function groupTicks(d) {
  var anglePerPerson = (d.endAngle - d.startAngle) / d.value;
  var personsPerPercent = totalCount / 100;
  return d3.range(0, d.value, personsPerPercent).map(function (v, i) {
    return {
      angle: v * anglePerPerson + d.startAngle,
      label: i % 5 ? null : v / personsPerPercent + "%"
    };
  });
};

//Hides all chords except the chords connecting to the subgroup / location of the given index.
function highlightChords(index) {
  //If this subgroup is already highlighted, toggle all chords back on.
  if (focusedChordGroupIndex === index) {
    showAllChords();
    return;
  }

  hideAllChords();

  //Show only the ones with source or target == index
  d3.selectAll(".chord-source-" + index + ", .chord-target-" + index)
    .style("fill-opacity", "0.7")
    .style("stroke-opacity", "1");

  focusedChordGroupIndex = index;
}

function showAllChords() {
  svg.selectAll("path.chord")
    .style("fill-opacity", "0.7")
    .style("stroke-opacity", "1");

  focusedChordGroupIndex = null;
}

function hideAllChords() {
  svg.selectAll("path.chord")
    .style("fill-opacity", "0")
    .style("stroke-opacity", "0");
}


////////////////////////////////////////////////////////////
//////////// Custom Chord Layout Function //////////////////
/////// Places the Chords in the visually best order ///////
///////////////// to reduce overlap ////////////////////////
////////////////////////////////////////////////////////////
//////// Slightly adjusted by Nadieh Bremer ////////////////
//////////////// VisualCinnamon.com ////////////////////////
////////////////////////////////////////////////////////////
////// Original from the d3.layout.chord() function ////////
///////////////// from the d3.js library ///////////////////
//////////////// Created by Mike Bostock ///////////////////
////////////////////////////////////////////////////////////
function customChordLayout() {
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
  var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
  function relayout() {
    var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
    var numSeq;
    chords = [];
    groups = [];
    k = 0, i = -1;

    while (++i < n) {
      x = 0, j = -1, numSeq = [];
      while (++j < n) {
        x += matrix[i][j];
      }
      groupSums.push(x);
      //////////////////////////////////////
      ////////////// New part //////////////
      //////////////////////////////////////
      for (var m = 0; m < n; m++) {
        numSeq[m] = (n + (i - 1) - m) % n;
      }
      subgroupIndex.push(numSeq);
      //////////////////////////////////////
      //////////  End new part /////////////
      //////////////////////////////////////
      k += x;
    }//while

    k = (τ - padding * n) / k;
    x = 0, i = -1;
    while (++i < n) {
      x0 = x, j = -1;
      while (++j < n) {
        var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
        subgroups[di + "-" + dj] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }//while

      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: (x - x0) / k
      };
      x += padding;
    }//while

    i = -1;
    while (++i < n) {
      j = i - 1;
      while (++j < n) {
        var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
        if (source.value || target.value) {
          chords.push(source.value < target.value ? {
            source: target,
            target: source
          } : {
            source: source,
            target: target
          });
        }//if
      }//while
    }//while
    if (sortChords) resort();
  }//function relayout

  function resort() {
    chords.sort(function (a, b) {
      return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
    });
  }
  chord.matrix = function (x) {
    if (!arguments.length) return matrix;
    n = (matrix = x) && matrix.length;
    chords = groups = null;
    return chord;
  };
  chord.padding = function (x) {
    if (!arguments.length) return padding;
    padding = x;
    chords = groups = null;
    return chord;
  };
  chord.sortGroups = function (x) {
    if (!arguments.length) return sortGroups;
    sortGroups = x;
    chords = groups = null;
    return chord;
  };
  chord.sortSubgroups = function (x) {
    if (!arguments.length) return sortSubgroups;
    sortSubgroups = x;
    chords = null;
    return chord;
  };
  chord.sortChords = function (x) {
    if (!arguments.length) return sortChords;
    sortChords = x;
    if (chords) resort();
    return chord;
  };
  chord.chords = function () {
    if (!chords) relayout();
    return chords;
  };
  chord.groups = function () {
    if (!groups) relayout();
    return groups;
  };
  return chord;
};

////////////////////////////////////////////////////////////
//////////// Custom Chord Path Generator ///////////////////
///////// Uses cubic bezier curves with quadratic //////////
/////// spread of control points to minimise overlap ///////
////////////////// of adjacent chords. /////////////////////
////////////////////////////////////////////////////////////
//////// Slightly adjusted by Severin Zahler ///////////////
////////////////////////////////////////////////////////////
/////// Original from the d3.svg.chord() function //////////
///////////////// from the d3.js library ///////////////////
//////////////// Created by Mike Bostock ///////////////////
////////////////////////////////////////////////////////////
function customChordPathGenerator() {
  var source = function(d) { return d.source; };
  var target = function(d) { return d.target; };
  var radius = function(d) { return d.radius; };
  var startAngle = function(d) { return d.startAngle; };
  var endAngle = function(d) { return d.endAngle; };

  function chord(d, i) {
    var s = subgroup(this, source, d, i),
        t = subgroup(this, target, d, i);

    var path = "M" + s.p0
    + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t)
                                     ? curve(s.r, s.p1, s.a1, s.r, s.p0, s.a0)
                                     : curve(s.r, s.p1, s.a1, t.r, t.p0, t.a0)
                                     + arc(t.r, t.p1, t.a1 - t.a0)
                                     + curve(t.r, t.p1, t.a1, s.r, s.p0, s.a0))
    + "Z";

    return path;
  }

  function subgroup(self, f, d, i) {
    var subgroup = f.call(self, d, i),
        r = radius.call(self, subgroup, i),
        a0 = startAngle.call(self, subgroup, i) - (Math.PI / 2),
        a1 = endAngle.call(self, subgroup, i) - (Math.PI / 2);

    return {
      r: r,
      a0: a0,
      a1: a1,
      p0: [r * Math.cos(a0), r * Math.sin(a0)],
      p1: [r * Math.cos(a1), r * Math.sin(a1)]
    };
  }

  function equals(a, b) {
    return a.a0 == b.a0 && a.a1 == b.a1;
  }

  function arc(r, p, a) {
    return "A" + r + "," + r + " 0 " + +(a > Math.PI) + ",1 " + p;
  }

  function curve(r0, p0, a0, r1, p1, a1) {
    //////////////////////////////////////
    ////////////// New part //////////////
    //////////////////////////////////////
    var deltaAngle = Math.abs(mod((a1 - a0 + Math.PI), (2 * Math.PI)) - Math.PI);
    var radialControlPointScale = Math.pow((Math.PI - deltaAngle) / Math.PI, 2) * 0.9;
    var controlPoint1 = [p0[0] * radialControlPointScale, p0[1] * radialControlPointScale];
    var controlPoint2 = [p1[0] * radialControlPointScale, p1[1] * radialControlPointScale];
    var cubicBezierSvg = "C " + controlPoint1[0] + " " + controlPoint1[1] + ", " + controlPoint2[0] + " " + controlPoint2[1] + ", " + p1[0] + " " + p1[1];
    return cubicBezierSvg;
    //////////////////////////////////////
    //////////  End new part /////////////
    //////////////////////////////////////
  }

  function mod(a, n) {
    return (a % n + n) % n;
  }

  chord.radius = function(v) {
    if (!arguments.length) return radius;
    radius = typeof v === "function" ? v : function() { return v; };
    return chord;
  };

  chord.source = function(v) {
    if (!arguments.length) return source;
    source = typeof v === "function" ? v : function() { return v; };
    return chord;
  };

  chord.target = function(v) {
    if (!arguments.length) return target;
    target = typeof v === "function" ? v : function() { return v; };
    return chord;
  };

  chord.startAngle = function(v) {
    if (!arguments.length) return startAngle;
    startAngle = typeof v === "function" ? v : function() { return v; };
    return chord;
  };

  chord.endAngle = function(v) {
    if (!arguments.length) return endAngle;
    endAngle = typeof v === "function" ? v : function() { return v; };
    return chord;
  };

  return chord;
}
