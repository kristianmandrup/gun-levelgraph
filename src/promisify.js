export function promisify(fun, obj, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      // console.log('cb', err, obj)
      err ? reject(err) : resolve(obj)
    }
    fun(obj, cb, ...args)
  })
}

export function promisifyWithOpts(fun, obj, opts, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      // console.log('promisifyWithOpts cb:', err, obj)
      err ? reject(err) : resolve(obj)
    }
    // console.log('promisifyWithOpts:', obj, opts, fun)
    fun(obj, opts, cb, ...args)
  })
}