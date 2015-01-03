'use strict';

console.log('Tab Search starting!');

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58195300-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function handleSpotlight(request) {
  var port = this;

  if (request.hasOwnProperty('query')) {
    chrome.tabs.query({active: false}, function(tabs) {
      chrome.tabs.sendMessage(port.sender.tab.id, {tabs: tabs});
    });
  } else if (request.hasOwnProperty('activate')) {
    _gaq.push(['_trackEvent', 'Background', 'Activate']);
    chrome.tabs.update(request.activate, {active: true});
  }
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(handleSpotlight.bind(port));
});
