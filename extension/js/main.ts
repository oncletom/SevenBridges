"use strict";

declare var graphViz;
declare var Crawler;
var nodesByUrl = new Map<string, Object>();
var nodesByDomain = new Map<string, Object>();

document.addEventListener('DOMContentLoaded', e => {

  console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");

  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
  xhr.responseType = 'json';
  xhr.addEventListener('load', e => {
      var nodes = [];

      xhr.response.forEach(url => {
          var node = { label: Crawler.getUrlDomain(url) };

          nodesByUrl.set(url, node);
          nodesByDomain.set(Crawler.getUrlDomain(url), node);

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

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action !== 'domains') {
        return;
    }

    var domains = message.domains;
    var domain = Crawler.getUrlDomain(message.url);
    var edges = [];
    var nodes = [];

    domains.forEach(d => {
        if (!nodesByDomain.has(d)){
            var node = { label: d };

            nodesByDomain.set(d, node);
            nodes.push(node);
        }

        edges.push({
            source: nodesByDomain.get(domain),
            target: nodesByDomain.get(d)
        });
    });

    graphViz.updateGraph(nodes, edges);
});


