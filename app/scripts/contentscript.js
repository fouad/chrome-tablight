'use strict';

var holder, tabList, _port, _cursor;
var opened = false;
var _tabs = [];

function _listTab(tab) {
  var item = document.createElement('div');
  item.classList.add('tab-item');

  var title = document.createElement('h2');
  title.classList.add('tab--title');
  title.innerText = tab.title;

  var link = document.createElement('p');
  link.classList.add('tab--link');
  link.innerText = tab.url;

  item.appendChild(title);
  item.appendChild(link);
  item.tabId = tab.id;

  function navigateTab() {
    _closeSearch();
    _port.postMessage({activate: item.tabId});
  }

  item.addEventListener('click', navigateTab);
  item.navigate = navigateTab;

  tabList.appendChild(item);
}

function _openSearch(port) {
  console.log(port);
  _port = port;
  opened = true;
  holder = document.createElement('div');
  holder.classList.add('tab-search');
  tabList = document.createElement('div');
  tabList.classList.add('tab-list');

  setTimeout(function() {
    holder.classList.add('fadeIn');
  }, 0);

  var input = document.createElement('input');

  input.placeholder = 'Tab Search';

  holder.appendChild(input);
  holder.appendChild(tabList);
  document.body.appendChild(holder);
  
  input.focus();

  input.addEventListener('click', function(e) {
    e.stopPropagation();
  }, false);
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      return _closeSearch();
    }
  });
  input.addEventListener('keydown', function(e) {
    var val = input.value.trim();

    // por

    if (e.keyCode === 38) {

    } else if (e.keyCode === 40) {

    } else if (e.keyCode === 27) {
      return _closeSearch();
    } else if (e.keyCode === 8 && val.length === 0) {
      return _closeSearch();
    } else if (e.keyCode === 13 && val.length > 0) {
      var tabs = _tabs.filter(function(tab) {
        return tab.url.indexOf(val) >= 0 || tab.title.trim().toLowerCase().indexOf(val) >= 0;
      });

      if (tabs.length > 0) {
        tabList.firstChild.navigate();
      }
    }
  });

  input.addEventListener('keyup', function() {
    var val = input.value.trim().toLowerCase();

    _port.postMessage({query: val});

    while (tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    if (val.length === 0) {
      return;
    }

    _cursor = null;

    var tabs = _tabs.filter(function(tab) {
      return tab.url.indexOf(val) >= 0 || tab.title.trim().toLowerCase().indexOf(val) >= 0;
    });

    tabs.map(_listTab);
  });
}

function _closeSearch() {
  opened = false;

  if (holder) {
    holder.classList.remove('fadeIn');
  }
  setTimeout(function() {
    if (holder) {
      holder.parentNode.removeChild(holder);
    }

    holder = null;
    tabList = null;
    _port = null;
  }, 250);
}

function _listenBack() {
  _closeSearch();
  document.removeEventListener('click', _listenBack);
}

function _listen() {
  document.addEventListener('keydown', function handleKeyup(e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
      e.preventDefault();
      
      if (!opened) {
        _openSearch();
        document.addEventListener('click', _listenBack);
      }

      return false;
    }
  }, false);
}

function loadTabs(response) {
  _tabs = response.tabs;
}

function TabSearch() {
  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      if (msg.hasOwnProperty('tabs')) {
        loadTabs(msg);

        if (!opened) {
          _openSearch(port);
          document.addEventListener('click', _listenBack);
        }
      }
    });
  });

  // port = chrome.runtime.connect({name: 'tab-search'});

  // port.postMessage({query: ''});
  // port.onMessage.addListener(loadTabs);
  // chrome.runtime.onMessage.addListener(loadTabs);
}

// _listen();
TabSearch();
