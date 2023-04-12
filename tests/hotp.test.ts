import { Hotp } from '../src/hotp'

describe('HOTP - ASCII Encoded Key', () => {
  const keys = [
    { key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ', value: '186689' },
    { key: '11223344556677AABBCCDD', value: '490323' },
    { key: '11223344556677AABBCCD', value: '684076' },
    { key: '11223344556677AABBCC', value: '471834' },
    { key: '11223344556677AABBC', value: '395052' },
    { key: '11223344556677AABB', value: '186748' },
    { key: '11223344556677AAB', value: '483321' },
  ]

  for (let obj of keys) {
    test(`Secret key Length ${obj.key.length}`, async () => {
      const h = new Hotp(obj.key)

      h.setOptions({ keyEncoding: 'ascii', counter: 0 })

      expect(await h.generate()).toEqual(obj.value)
    })
  }
})

describe('HOTP - HEX Encoded Key', () => {
  const keys = [
    { key: 'bd757ea0dc8b46b14f42dceb15a30cd9', value: '732551'},
    { key: '11223344556677AABBCCDD', value: '712409' },
    { key: '11223344556677AABBCC', value: '409133' },
    { key: '11223344556677AABB', value: '152257' },
  ]

  for (let obj of keys) {
    test(`Secret key Length ${obj.key.length}`, async () => {
      const h = new Hotp(obj.key)

      h.setOptions({ keyEncoding: 'hex', counter: 0 })

      expect(await h.generate()).toEqual(obj.value)
    })
  }

  test(`Should throw error on invalid hex key`, async () => {
    const h = new Hotp('11223344556677AABBC')

    h.setOptions({ keyEncoding: 'hex', counter: 0 })

    await expect(async () => await h.generate()).rejects.toThrowError()
  })
})