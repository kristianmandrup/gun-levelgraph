export function promisify(fun, arg1, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      // console.log('cb', err, obj)
      err ? reject(err) : resolve(obj)
    }
    fun(arg1, cb, ...args)
  })
}

export function promisify2(fun, arg1, arg2, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      // console.log('promisifyWithOpts cb:', err, obj)
      err ? reject(err) : resolve(obj)
    }
    // console.log('promisifyWithOpts:', obj, opts, fun)
    fun(arg1, arg2, cb, ...args)
  })
}

export function promisify3(fun, arg1, arg2, arg3, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      // console.log('promisifyWithOpts cb:', err, obj)
      err ? reject(err) : resolve(obj)
    }
    // console.log('promisifyWithOpts:', obj, opts, fun)
    fun(arg1, arg2, arg3, cb, ...args)
  })
}