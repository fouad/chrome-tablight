var Base = require('./Base');

class Tab extends Base {
  search(text) {
    chrome.tabs.query({active: false}, function(tabs) {
      this.results = _tabs.filter(function(tab) {
        return tab.url.indexOf(val) >= 0 ||
               tab.title.trim().toLowerCase().indexOf(val) >= 0;
      });
      this.done();
    });
  }
  normalize(payload) {
    payload.type = 'tab.open';

    return payload;
  }
}

module.exports = Tab;
