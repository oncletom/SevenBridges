'use strict';

class Crawler{
    constructor(public options:CrawlerOptions){
    }

    getLinks(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'document';
        xhr.addEventListener('load', e => {
            var links = [].slice.call(xhr.responseXML.querySelectorAll('a')).map(link => link.href);
            callback(links);
        });

        xhr.send();
    }
}