'use strict';

var debounce = require('debounce');
var ui = require('./ui');
var cursor = require('./cursor');
var utils = require('./utils');
var holder, tabList, _port, _cursor, wrapper;
var opened = false;
var _tabs = [];

function _layoutSearch() {
  var i = document.querySelector('.tab-item');
  var list = document.querySelector('.tab-list');

  if (i === null || list === null) {
    return;
  }

  list.className = 'gradient';
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
  wrapper.className = 'tab-wrapper';  
  holder = document.createElement('div');
  holder.className = 'tab-search';

  setTimeout(function() {
    wrapper.className = 'tab-wrapper fadeIn';
  }, 0);

  var input = document.createElement('input');
  input.setAttribute("autofocus", "true");
  input.setAttribute("tabindex", "1");
  input.placeholder = 'Tab Search';

  wrapper.appendChild(holder);
  holder.appendChild(input);
  holder.appendChild(ui.list.render());
  document.body.appendChild(wrapper);

  var siblings = [];
  var elCursor = wrapper;

  while (elCursor.previousSibling) {
    elCursor = elCursor.previousSibling;

    siblings.push(elCursor);
  }

  siblings.map((s) => {
    if (s) {
      s.className = 'tablight--blur';
    }
  });

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
      
      if (e.which === 13) {
        cursor.enter();
      } else if (e.which === 38) {
        cursor.up();
      } else if (e.which === 40) {
        cursor.down();
      } else if (e.keyCode === 27) {
        return _closeSearch();
      } else if (e.keyCode === 8 && val.length === 0) {
        return _closeSearch();
      } else if (e.keyCode === 13 && val.length > 0) {

        var tabs = _tabs.filter(function(tab) {
          return tab.url.indexOf(val) >= 0 || tab.title.trim().toLowerCase().indexOf(val) >= 0;
        });

        // if (tabs.length > 0) {
        //   tabList.firstChild.navigate();
        // }
      }
  });

  input.addEventListener('keyup', () => {
    var val = input.value.trim().toLowerCase();
    // console.log(val);

    // -----------------------------------------------------------------------------------------
    // Below matchs input text to results TODO: Bold these results in the template
    // var items = document.querySelectorAll('.tab-item');
    // for (var i = 0; i < items.length; i++) {
    //   var txtmatch = items[i].innerText.match(val);
    //   if (txtmatch) {
    //     var matchezz = txtmatch.input.substring(txtmatch.index, txtmatch.index + val.length);
    //   }
    // }
    // -----------------------------------------------------------------------------------------

    // while (tabList && tabList.firstChild) {
    //   tabList.removeChild(tabList.firstChild);
    // }

    _cursor = null;

    if (val.length === 0 || val === null) {
      return;
    }

    // TODO: modify to grab results
    _port.postMessage({query: val});
  });

  input.addEventListener('input', () => {
    _layoutSearch();
  });
}

document.addEventListener('scroll', (e) => {
  e.preventDefault();
});

function _closeSearch() {
  opened = false;

  if (wrapper) {
    wrapper.className = 'tab-wrapper';
  }

  var blurredNodes = document.querySelectorAll('.tablight--blur');
  if (blurredNodes) {
    for (var i = 0; i < blurredNodes.length; i++) {
      blurredNodes[i].classList.remove('tablight--blur');
    };
  }

  // Removes all instances of tab-wrapper from the DOM
  var tabWrapper = document.querySelectorAll('.tab-wrapper');
  for (var i = 0; i < tabWrapper.length; i++) {
    if (tabWrapper[i].parentNode) {
      tabWrapper[i].parentNode.removeChild(tabWrapper[i])
    }
  };

  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }
  setTimeout(() => {
    wrapper = null;
    tabList = null;
    // _port = null;
  }, 250);
}

function _listenBack() {
  _closeSearch();
  document.removeEventListener('click', _listenBack);
}

// function _listen() {
  // document.addEventListener('keydown', function handleKeyup(e) {
  //   if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
  //     e.preventDefault();
      
  //     if (!opened) {
  //       // _openSearch();
  //       document.addEventListener('click', _listenBack);
  //     }

  //     return false;
  //   }
  // }, false);
// }

function loadTabs(response) {
  _tabs = response.tabs || response.results;
  if (_tabs && _tabs.length) {
    ui.list.set('results', _tabs);
  }
}

function debounceLoadTabs(msg) {
  if (tabList) {
    while (tabList && tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }
  }
  loadTabs.bind({}, msg)();

  debounce(loadTabs.bind({}, msg), 300);
}

function TabSearch() {
  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      if (msg.hasOwnProperty('results')) {
        debounceLoadTabs(msg);
      } else if (msg.hasOwnProperty('tabs')) {
        debounceLoadTabs(msg);
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
