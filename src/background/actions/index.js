var async = require('async');
var collapseDeep = require('collapse-array/deep');
var Tab = require('./Tab');
var History = require('./History');
var actions = [];

// TODO: user customizable
actions.push([Tab.expose(), Tab]);
actions.push([History.expose(), History]);

module.exports = {
  search(text, cb) {
    var promise = new Promise();
    
    async.mapEach(actions, (a, cb) => {
      let props = a[0];
      let action = a[1];

      // check if action is appropriate (for performance)
      if (props.regex.test(text)) {
        new action(text, (results) => {
          cb(results);
        });
      } else {
        cb([]);
      }
    }, (err, results) => {
      if (err) {
        promise.reject(err);
      }

      promise.resolve(results);
    });

    return promise;
  }
};
