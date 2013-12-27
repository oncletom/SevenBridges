"use strict"

var c = new Crawler({ limit: 5 });

//example of using a message handler from the inject scripts
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.create({url: 'index.html'});
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (!('action' in message) || message.action !== 'crawl'){
	    return;
    }

    /*c.getLinks(message.url, function(links){
        chrome.runtime.sendMessage({ action: 'links', url: message.url, links: links });
    });*/

    c.getDomains(message.url, domains => {
        chrome.runtime.sendMessage({ action: 'domains', url: message.url, domains: domains });
    });
});