import Gun from 'gun/gun'
import test from 'ava'
import '../src/to-jsonld'
import chain from 'gun-edge'
chain(Gun)
const gun = Gun();

test('savejsonld', async t => {
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
  mark.path('self').put(mark)

  let val = await mark.$value()
  console.log('mark', val)

  let {
    result,
    json
  } = await mark.$toJsonLd({
    paths: ['wife', 'self']
  })
  console.log('JSONLD', json)
  t.is(result.name, 'mark')
  t.is(result.wife.name, 'amber')
})