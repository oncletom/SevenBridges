"use strict";

declare var Crawler;
var nodesByDomain = new Map<string, Object>();

var g = new sigma({
    container: 'graph-container'
});


var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
xhr.responseType = 'json';
xhr.addEventListener('load', e => {
  var nodes = [];

  xhr.response.slice(0, 30)
    .map(Crawler.getUrlDomain)
    .filter((domain, i, a) => a.indexOf(domain, i+1) === -1)
    .forEach(domain => {
      var node = {
          id: domain,
          label: domain,
          size: Math.random(),
          x: 0,
          y: 0,
          color: '#666'
      };

      nodesByDomain.set(Crawler.getUrlDomain(url), node);

      g.graph.addNode(node);

      //chrome.runtime.sendMessage({ action: 'crawl', url: url });
  });

});

xhr.send();

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
            var node = {
                id: d,
                label: d,
                x: 0,
                y: 0,
                size: Math.random(),
                color: '#666'
            };

            nodesByDomain.set(d, node);
            g.graph.addNode(node);
        }

        g.graph.addEdge({
            id: domain + d,
            source: nodesByDomain.get(domain),
            target: nodesByDomain.get(d),
            size: Math.random(),
            color: '#666'
        });
    });
});

g.startForceAtlas2();
