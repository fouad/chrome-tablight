var port = chrome.runtime.connect({name: "tablight"});
var vspan = document.querySelector('.version');
var osCut = document.querySelector('.os');

port.onMessage.addListener(function(msg) {
  vspan.innerText = msg.version;
  osCut.innerText = msg.command.shortcut;
  console.log(msg.command);
});
port.postMessage({
  version: true
});

var decline = document.querySelector('.analytics-decline');
var accept = document.querySelector('.analytics-accept');
var configure = document.querySelector('.configure');

decline.addEventListener('click', function() {
  window.close();
});

configure.addEventListener('click', function() {
  chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
});

accept.addEventListener('click', function() {
  port.postMessage({
    analytics: true
  });
});
