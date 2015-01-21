'use strict';

console.log('Tab Search starting!');
var _gaq = _gaq || [];
var _tracking = false;

chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    var permissionUrl = chrome.extension.getURL('pages/permission.html');

    chrome.tabs.create({url: permissionUrl});
  }else if(details.reason == "update"){
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    var noticeUrl = chrome.extension.getURL('pages/permission.html');

    chrome.tabs.create({url: noticeUrl});
  }
});

chrome.commands.onCommand.addListener(function(command) {
  var contentScript = chrome.extension.getURL('scripts/contentscript.js');
  var contentStyle = chrome.extension.getURL('styles/main.css');

  chrome.tabs.query({active: true}, function(tabs) {
    var currentTab = tabs[0];
    console.log(contentScript);

    chrome.tabs.executeScript({file: 'scripts/contentscript.js'}, function() {
      var port = chrome.tabs.connect(currentTab.id);

      chrome.tabs.query({active: false}, function(tabs) {
        port.postMessage({tabs: tabs});
        port.onMessage.addListener(handleSpotlight.bind(port));
      });
    });
    chrome.tabs.insertCSS({file: 'styles/main.css'});
  });
});

function setupTracking() {
  if (!_tracking) {
    return;
  }

  _gaq.push(['_setAccount', 'UA-58195300-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}

var actions = {
  facebook: {

  }
};

function lookup(type) {
  actions[type];
}

function handleSpotlight(request) {
  var port = this;

  if (request.hasOwnProperty('query')) {
    var query = request.query.trim();

    if (query.indexOf('fb ') === 0) {

      chrome.tabs.query({url: '*://www.facebook.com/*'}, function(tabs) {
        if (tabs.length < 1) {
          chrome.tabs.create({
            url: 'https://www.facebook.com', 
            active: false
          }, function() {
            lookup('facebook');
          });
        } else {
          lookup('facebook');
        }
      });
    }    
    // chrome.tabs.query({active: false}, function(tabs) {
    //   chrome.tabs.sendMessage(port.sender.tab.id, {tabs: tabs});
    // });
  } else if (request.hasOwnProperty('activate')) {
    if (_tracking) {
      _gaq.push(['_trackEvent', 'Background', 'Activate']);
    }

    chrome.tabs.update(request.activate, {active: true});
  } else if (request.hasOwnProperty('version')) {
    chrome.commands.getAll(function(commands) {
      port.postMessage({
        version: chrome.runtime.getManifest().version,
        command: commands[0]
      });
    });
  } else if (request.hasOwnProperty('analytics')) {
    _tracking = true;
    setupTracking();
    chrome.tabs.remove(port.sender.tab.id);
  }
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(handleSpotlight.bind(port));
});
