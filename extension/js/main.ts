"use strict";

declare var graphViz;
var nodesByUrl = new Map<string, Object>();

document.addEventListener('DOMContentLoaded', e => {

  console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");

  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
  xhr.responseType = 'json';
  xhr.addEventListener('load', e => {
      var nodes = [];

      xhr.response.forEach(url => {
          var node = { label: url };
          nodesByUrl.set(url, node);
          nodes.push(node);

          chrome.runtime.sendMessage({ action: 'crawl', url: url });
      });

      graphViz.updateGraph(nodes, []);
  });

  xhr.send();
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action !== 'links') {
        return;
    }

    var links = message.links;
    var url = message.url;
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


