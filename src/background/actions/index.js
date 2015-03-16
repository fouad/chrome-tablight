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
    var promise = new Promise((resolve, reject) => {
      async.map(actions, (a, cb) => {
        let props = a[0];
        let action = a[1];

        // check if action is appropriate (for performance)
        if (props.regex.test(text)) {
          new action(text, (results) => {
            cb(null, results);
          });
        } else {
          cb(null, []);
        }
      }, (err, results) => {
        resolve(results.reduce((a, b) => {
          b.map((d) => a.push(d));

          return a;
        }, []));

      });
    });

    return promise;
  }
};
