import Gun from 'gun/gun'
import test from 'ava'
import '../src/triplets'

const gun = Gun();

test('saveTriplets', async t => {
  let name = 'mark'
  let mark = gun.get('mark').put({
    name,
    gender: 'male'
  })

  let triplets = await gun.get('mark').toTriplets()
  console.log(triplets)
  t.is(triplets.name, name)
})