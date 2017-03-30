import Gun from 'gun/gun'
import {
  createFunctions
} from '../../src/to-jsonld'

// TODO: deprecated! use chain-gun instead
import chain from 'gun-edge'
chain(Gun)

const gun = Gun();

export async function sampleGunToJsonLd() {
  let mark = gun.get('mark')
  let amber = gun.get('amber')

  amber.put({
    name: 'amber',
    gender: 'female'
  })

  mark.put({
    name: 'mark',
    gender: 'male',
  })

  // mark.path('wife').put(amber)
  mark.putAt('wife', amber)

  // mark.path('self').put(mark)
  mark.putAt('self', mark)

  let val = await mark.$value()

  let {
    toLdGraph,
    toJsonLd
  } = createFunctions({
    // logging: true
  })

  let {
    result,
    json
  } = await toJsonLd(mark, {
    // schemaUrl: 'http://schema.org/',
    // graphId: (id, opts) => graphId (string)
  })

  return json
}