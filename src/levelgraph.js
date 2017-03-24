import Gun from 'gun/gun'
import 'gun-edge'

var levelup = require('levelup'),
  yourDB = levelup('./yourdb'),
  levelgraph = require('levelgraph'),
  jsonld = require('levelgraph-jsonld'),
  opts = {
    base: 'http://gun.io/base'
  }

export const db = jsonld(levelgraph(yourDB), opts);

export function toLvGraph(cb, opt) {
  this.value((v) => {
    // convert here
    cb(v)
  }, opt)
}

Gun.chain.toTriplets = toLvGraph