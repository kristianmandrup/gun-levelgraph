'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
exports.promisifyWithOpts = promisifyWithOpts;
function promisify(fun, obj) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      // console.log('cb', err, obj)
      err ? reject(err) : resolve(obj);
    };
    fun.apply(undefined, [obj, cb].concat(args));
  });
}

function promisifyWithOpts(fun, obj, opts) {
  for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      console.log('promisifyWithOpts cb:', err, obj);
      err ? reject(err) : resolve(obj);
    };
    console.log('promisifyWithOpts:', obj, opts, fun);
    fun.apply(undefined, [obj, opts, cb].concat(args));
  });
}
//# sourceMappingURL=promisify.js.map
