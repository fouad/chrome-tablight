var Base = require('./Base');

class Tab extends Base {
  search(text) {
    chrome.tabs.query({active: false}, (tabs) => {
      this.results = tabs.filter(function(tab) {
        return tab.url.indexOf(text) >= 0 ||
               tab.title.trim().toLowerCase().indexOf(text) >= 0;
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
