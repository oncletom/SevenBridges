"use strict";

declare var graphViz;

document.addEventListener('DOMContentLoaded', e => {
  
  console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");
  
  var nodes = [{},{},{},{},{},{},{}];
  graphViz.updateGraph(nodes, [
    {
      source: nodes[0],
      target: nodes[1]
    },
    {
      source: nodes[0],
      target: nodes[2]
    },
    {
      source: nodes[2],
      target: nodes[3]
    },
    {
      source: nodes[1],
      target: nodes[4]
    },
    {
      source: nodes[4],
      target: nodes[5]
    },
    {
      source: nodes[5],
      target: nodes[2]
    }
  ]);
  
  window.addEventListener('message', e => {
    //graphViz.updateGraph(e.nodes, e.edges);
    throw 'TODO';
  });
  
})


