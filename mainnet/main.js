var indexMap = {
  77: 0,
  100: 0,
  69: 1,
  137: 1,
  42: 2,
  1: 2
}

var indexMapDest = {
  77: 2,
  100: 2,
  69: 3,
  137: 3,
  42: 4,
  1: 4
}

const links = data.map(x => {
  return {
  source: indexMap[x.sourceChain],
  target: indexMapDest[x.destinationChain],
  value: 1
  }
})

const graph = {
  "nodes":[
    {"node":0,"name":"xDai", "id": "xdai"},
    //{"node":1,"name":"Optimism", "id": "optimism"},
    {"node":1,"name":"Polygon", "id": "polygon"},

    {"node":3,"name":"xDai", "id": "xdai"},
    //{"node":4,"name":"Optimism", "id": "optimism"},
    {"node":4,"name":"Polygon", "id": "polygon"},
    {"node":5,"name":"Ethereum", "id": "ethereum"},
  ],
  "links":links
}

var json = graph
var colors = {
  'xdai': '#edbd00',
  'ethereum': '#367d85',
  'optimism': '#97ba4c',
  //'polygon': '#8d4cba',
  'polygon': '#97ba4c',
  'foo': '#f5662b',
  'bar': '#3f3e47',
  'fallback': '#9f9fa3',
};

const transfers = data.map(x => {
  return `${x.sourceChain}→${x.destinationChain} transferId:${x.transferId}`
})
const ul = d3.select("#transfers")
  .append('ul')

ul
  .selectAll('li')
  .data(transfers)
  .enter()
  .append('li')
  .html(String)

function render() {
    d3.select("#chart svg").remove()
    //d3.json("//cdn.rawgit.com/q-m/d3.chart.sankey/master/example/data/product.json", function(error, json) {
      var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
      chart
        .name(label)
        .colorNodes(function(name, node) {
          return color(node, 1) || colors.fallback;
        })
        .colorLinks(function(link) {
          return color(link.source, 4) || color(link.target, 1) || colors.fallback;
        })
        .nodeWidth(15)
        .nodePadding(10)
        .spread(true)
        .iterations(0)
        .draw(json);

console.log(chart)
      function label(node) {
        return node.name.replace(/\s*\(.*?\)$/, '');
      }
      function color(node, depth) {
        var id = node.id.replace(/(_score)?(_\d+)?$/, '');
        if (colors[id]) {
          return colors[id];
        } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
          return color(node.targetLinks[0].source, depth-1);
        } else {
          return null;
        }
      }
    //});
}

render()
window.addEventListener('resize', event => {
  render()
})
