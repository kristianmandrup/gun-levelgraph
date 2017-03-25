import Gun from 'gun/gun'
import test from 'ava'
import '../src/to-jsonld'
import chain from 'gun-edge'
chain(Gun)
const gun = Gun();

test('savejsonld', async t => {
  let name = 'mark'
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

  mark.path('wife').put(amber)

  let val = await mark.$value()
  console.log('mark', val)

  let jsonld = await mark.$toJsonLd({
    paths: ['wife']
  })
  console.log(jsonld)
  t.is(jsonld.name, 'mark')
  t.is(jsonld.wife.name, 'amber')
})