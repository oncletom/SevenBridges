"use strict";
document.addEventListener('DOMContentLoaded', function (e) {
    console.log('graphViz loaded?', typeof graphViz.updateGraph === "function");

    var nodesByUrl = new Map();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.runtime.getURL('/src/urls.json'));
    xhr.responseType = 'json';
    xhr.addEventListener('load', function (e) {
        var nodes = [];

        xhr.response.slice(0, 10).forEach(function (url) {
            var node = { label: url };
            nodesByUrl.set(url, node);
            nodes.push(node);

            chrome.runtime.sendMessage({ action: 'crawl', url: url }, function (links) {
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
        });

        graphViz.updateGraph(nodes, []);
    });
});
//# sourceMappingURL=main.js.map
