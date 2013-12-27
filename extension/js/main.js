"use strict";
var nodesByUrl = new Map();

document.addEventListener('DOMContentLoaded', function (e) {
    console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");

    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
    xhr.responseType = 'json';
    xhr.addEventListener('load', function (e) {
        var nodes = [];

        xhr.response.forEach(function (url) {
            var node = { label: url };
            nodesByUrl.set(url, node);
            nodes.push(node);

            chrome.runtime.sendMessage({ action: 'crawl', url: url });
        });

        graphViz.updateGraph(nodes, []);
    });

    xhr.send();
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.action !== 'links') {
        return;
    }

    var links = message.links;
    var url = message.url;
    var edges = [];
    var nodes = [];

    links.forEach(function (l) {
        if (!nodesByUrl.has(l)) {
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
//# sourceMappingURL=main.js.map
