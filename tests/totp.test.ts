import { Totp } from '../src/totp';

describe('TOTP - ASCII Encoded Key', () => {
  const keys = [
    { key: '11223344556677AABBCCDD', counter: 1677735728855, value: '460936' },
    { key: '11223344556677AABBCC', counter: 1677735728858, value: '430469' },
    { key: '11223344556677AABB', counter: 1677735728859, value: '000164' },
    { key: '11223344556677AAB', counter: 1677735809927, value: '774527' },
  ]

  for (let obj of keys) {
    test(`Secret key Length ${obj.key.length}`, async () => {
      const t = new Totp(obj.key)

      t.setOptions({ keyEncoding: 'ascii', counter: obj.counter })

      expect(await t.generate()).toEqual(obj.value)
    })
  }
})

describe('TOTP - HEX Encoded Key', () => {
  const keys = [
    { key: 'bd757ea0dc8b46b14f42dceb15a30cd9', counter: 1681272786436, value: '708627' },
    { key: '11223344556677AABBCCDD', counter: 1681271928564, value: '709143' },
    { key: '11223344556677AABBCC', counter: 1681271928569, value: '796118' },
    { key: '11223344556677AABB', counter: 1681271928571, value: '537914' },
    { key: '11223344556677AA', counter: 1681271928572, value: '819997' }
  ]

  for (let obj of keys) {
    test(`Secret key Length ${obj.key.length}`, async () => {
      const t = new Totp(obj.key)
      
      t.setOptions({ keyEncoding: 'hex', counter: obj.counter })

      expect(await t.generate()).toEqual(obj.value)
    })
  }

  test(`Should throw error on invalid hex key`, async () => {
    const t = new Totp('11223344556677AABBC')

    t.setOptions({ keyEncoding: 'hex', counter: 0 })

    await expect(async () => await t.generate()).rejects.toThrowError()
  })
})
