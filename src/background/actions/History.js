var Base = require('./Base');

class History extends Base {
  search(text) {
    let query = request.query.trim();
    let opts = {
      text: query,
      maxResults: 10
    };

    chrome.history.search(opts, (res) => {
      this.results = res;
      this.done();
    });
  }
  normalize(payload) {
    payload.type = 'tab.history';

    return payload;
  }
}

module.exports = History;
