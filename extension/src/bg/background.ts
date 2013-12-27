"use strict"

//example of using a message handler from the inject scripts
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.create({url: 'index.html'}, tab => {
    console.log('TODO: draw ')
  }) 
});   
  
