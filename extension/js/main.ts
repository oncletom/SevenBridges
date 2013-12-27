"use strict";

declare var graphViz;

document.addEventListener('DOMContentLoaded', e => {

  console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");

  var nodesByUrl = new Map<string, Object>();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
  xhr.responseType = 'json';
  xhr.addEventListener('load', e => {
      var nodes = [];

      xhr.response.slice(0, 10).forEach(url => {
          var node = { label: url };
          nodesByUrl.set(url, node);
          nodes.push(node);

          chrome.runtime.sendMessage({ action: 'crawl', url: url }, links => {
              var edges = [];
              var nodes = [];

              links.forEach(l => {
                  if (!nodesByUrl.has(l)){
                      var node = { label: l };

                      nodesByUrl.set(l, node);
                      nodes.push(node);
                  }

                  edges.push({
                      source: nodesByUrl.get(url),
                      target: nodesByUrl.get(l)
                  });
              });

              graphViz.updateGraph(nodes, edges);
          });
      });

      graphViz.updateGraph(nodes, []);
  });

});


