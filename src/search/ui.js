var pc = require('paperclip');
var templates = {}, views = {};

var TabItem = pc.Component.extend({
  initialize: function () {
    this.textNode = this.nodeFactory.createTextNode("");
    this.section.appendChild(this.textNode);
  },

  /**
   * called when the attributes change
   */

  update: function () {
    // called when attributes change
    this.textNode.nodeValue = "Hello " + this.attributes.message;
  }
});

templates.list = pc.template(`
  <div class="tab-list">
    <repeat each="{{results}}" as="result">
      <div class="tab-item" onClick="{{ navigateTo(result) }}">
        <h2 class="tab--title">
          <unsafe html="{{result.title}}" />
        </h2>
        <p class="tab--link">
          <unsafe html="{{result.url}}" />
        </p>
      </div>
    </repeat>
  </div>
`);

exports.list = views.list = templates.list.view({
  query: null,
  results: [],
  navigateTo(result) {
    if (result.type == "tab.history") {
      chrome.tabs.create({
        url: tab.url
      });
    } else if  (result.type == "tab.open") {
      _port.postMessage({activate: result.tabId});
    }
    _closeSearch();
  }
});
