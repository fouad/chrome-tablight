'use strict';

var utils = require('./utils');
var holder, tabList, _port, _cursor, wrapper;
var opened = false;
var _tabs = [];

function _listTab(tab) {
  if (!tabList) {
    return
  }

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

function addHistory(history) {
  var item = document.createElement('div');
  item.classList.add('tab-item');

  var title = document.createElement('h2');
  title.classList.add('tab--title');
  if (history.title) {
    title.innerText = history.title;
  } else {
    debugger
    // title.innerText = ;
  }

  var link = document.createElement('p');
  link.classList.add('tab--link');
  link.innerText = history.url;

  var visit = document.createElement('span');
  visit.classList.add('pull-right');
  var lastSeen = utils.msToTime(history.lastVisitTime);
  visit.innerText = "Total Views: " + history.visitCount + ' - ' +  "lastseen: " + lastSeen;

  item.appendChild(visit);
  item.appendChild(title);
  item.appendChild(link);

  tabList.appendChild(item);
}

function _layoutSearch(height) {
  var i = document.querySelector('.tab-item');
  var list = document.querySelector('.tab-list');
  var num = 0;

  if (i && i.parentNode) {
    var list = i.parentNode;
    num = list.childNodes.length;

    if (num > 4) {
      num = 4;
    }

    num *= i.offsetHeight;
  }

  list.style.height = num + 'px';
}

function _openSearch(port) {
  if (document.querySelectorAll('.tab-wrapper').length > 0) _closeSearch();
  console.log(port);
  _port = port;
  opened = true;
  wrapper = document.createElement('div');
  wrapper.classList.add('tab-wrapper');  
  holder = document.createElement('div');
  holder.classList.add('tab-search');
  tabList = document.createElement('div');
  tabList.classList.add('tab-list');

  setTimeout(function() {
    wrapper.classList.add('fadeIn');
  }, 0);

  var input = document.createElement('input');
  input.setAttribute("autofocus", "true");

  input.placeholder = 'Tab Search';

  wrapper.appendChild(holder);
  holder.appendChild(input);
  holder.appendChild(tabList);
  document.body.appendChild(wrapper);
  
  input.focus();

  input.addEventListener('click', (e) => {
    e.stopPropagation();
  }, false);
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
      return _closeSearch();
    }
  });
  input.addEventListener('keydown', (e) => {
    var val = input.value.trim();
    
    if (e.which === 40) {
      //up
    } else if (e.which === 38) {
      //down

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

    while (tabList && tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    _cursor = null;

    if (val.length === 0) {
      return;
    }

    // TODO: modify to grab results
    _port.postMessage({query: val});

    // var tabs = _tabs.filter(function(tab) {
    //   return tab.url.indexOf(val) >= 0 || tab.title.trim().toLowerCase().indexOf(val) >= 0;
    // });

    // tabs.map(_listTab);
  });

  input.addEventListener('input', () => {
    _layoutSearch();
  //   var i = document.querySelector('.tab-item');
  //   var list = i.parentNode;
  //   var num = list.childNodes.length;

  //   console.log('n:>', num);

  //   if (num > 4) {
  //     num = 4;
  //   }

  //   list.style.height = (i.offsetHeight * num) + 'px';
  });
}

function _closeSearch() {
  opened = false;

  if (wrapper) {
    wrapper.classList.remove('fadeIn');
  }

  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }
  setTimeout(() => {
    wrapper = null;
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
  _tabs = response.tabs || response.results;
  if (_tabs && _tabs.length) {
    _tabs.map(_listTab);
  }
}

function TabSearch() {
  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      if (msg.hasOwnProperty('results')) {
        loadTabs(msg);
      } else if (msg.hasOwnProperty('tabs')) {
        loadTabs(msg);
        if (!opened) {
          _openSearch(port);
          document.addEventListener('click', _listenBack);
        }
      } else if (msg.hasOwnProperty('history')) {
        for (var i = 0; i < msg.history.length; i++) {
          addHistory(msg.history[i]);
        };
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
