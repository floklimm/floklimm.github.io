var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");



//  var color = d3.scalePoint(d3.schemeCategory10);
var color = function (i) {return d3.schemeCategory20c[i]};

var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody().strength(-400).distanceMin(15).distanceMax(80))
        .force("center", d3.forceCenter(width / 2, height / 2));



//function readNetworkData() {}



function updateNetwork(omega,gamma) {
          simulation.alpha(1); // reheat


          linksRemove = d3.selectAll('line')
          linksRemove = linksRemove.remove();
          nodesRemove = d3.selectAll('g')
          nodesRemove = nodesRemove.remove();
          //

          createNetwork(omega,gamma)
          // node = node.data(nodes);
          // link = link.data(links);
          //
          // link.exit().remove();
          // node.exit().remove();





  }


function createNetwork(omega,gamma) {

  //alert("./communityGraph_gamma"+gamma.value+"omega"+omega.value+".json")
  d3.json("./communityGraph_gamma"+gamma+"omega"+omega+".json", function (error, graph) {
      if (error) throw error;

      //var link = d3.selectAll("svg")


        //link.exit().remove()

        var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

        var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter()
                .append("g")
                .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

      /* Draw the respective pie chart for each node */
      node.each(function (d) {
          NodePieBuilder.drawNodePie(d3.select(this), d.pieChart, {
              parentNodeColor: color(d.group),
              outerStrokeWidth: 12,
              showLabelText: false,
              labelText: d.id,
              labelColor: color(d.group),
              radius: d.moduleSize
          });
      });



      simulation
              .nodes(graph.nodes)
              .on("tick", ticked);

      simulation.force("link")
              .links(graph.links);



      function ticked() {

          link
                  .attr("x1", function (d) {
                      return d.source.x;
                  })
                  .attr("y1", function (d) {
                      return d.source.y;
                  })
                  .attr("x2", function (d) {
                      return d.target.x;
                  })
                  .attr("y2", function (d) {
                      return d.target.y;
                  });

          d3.selectAll("circle").attr("cx", function (d) {
                      return d.x;
                  })
                  .attr("cy", function (d) {
                      return d.y;
                  });

          d3.selectAll("text").attr("x", function (d) {
                      return d.x;
                  })
                  .attr("y", function (d) {
                      return d.y;
                  });
      }





  });



}






function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
