'use strict';

class Crawler{
    constructor(public options:CrawlerOptions){
    }

    getDocumentXhr(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'document';
        xhr.addEventListener('load', e => {
            callback(xhr.responseXML);
        });

        return xhr;
    }

    getLinks(url, callback){
        var xhr = this.getDocumentXhr(url, doc => {
            var links = [].slice.call(doc.querySelectorAll('a'))
                .map(link => link.href)
                .filter(Crawler.isUrl);

            callback(links);
        });

        xhr.send();
    }

    getDomains(url, callback){
        var xhr = this.getDocumentXhr(url, doc => {
            var links = [].slice.call(doc.querySelectorAll('a'))
                .map(link => link.href)
                .filter(Crawler.isUrl)
                .map(Crawler.getUrlDomain)
                .filter((d, i, a) => a.indexOf(d, i+1) === -1)      //quadratic

            callback(links);
        });

        xhr.send();
    }

    static getUrlDomain(url){
        return (url.match(/https?:\/\/([^\/]+)\//) || [])[1];
    }

    static isUrl(url){
        return url.match(/^http/);
    }
}