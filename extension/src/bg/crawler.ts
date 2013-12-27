'use strict';

class Crawler{
    private _queue = [];

    constructor(public options:CrawlerOptions){
    }

    getLinks(url, callback){
	var links = [];

	this.queue(url);

	callback(links);
    }

    queue(url){
	this._queue.push(url);
    }
}

export = Crawler;