import Gun from 'gun/gun'
import test from 'ava'
import '../src/triplets'
import chain from 'gun-edge'
chain(Gun)
const gun = Gun();

test('saveTriplets', async t => {
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

  let triplets = await mark.$toTriplets({
    paths: ['wife']
  })
  console.log(triplets)
  t.is(triplets.name, 'mark')
  t.is(triplets.wife.name, 'amber')
})