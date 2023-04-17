import { Authenticator } from '../src/authenticator';

describe('TOTP - HEX Encoded Key', () => {
  const keys = [
    { key: 'RWMA7T7LRRIYFFHYMKWR2ITQJK346XI2KE4SLKHV7HIW5JXBYFWHX3NCBNO75TOH', counter: 1681272786436, value: '345327' },
    { key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ', counter: 1681272786436, value: '555421' },
  ]

  for (let obj of keys) {
    test(`Secret key Length ${obj.key.length} - ${obj.key}`, async () => {
      const t = new Authenticator(obj.key)
      
      t.setOptions({ keyEncoding: 'hex', counter: obj.counter })

      expect(await t.generate()).toEqual(obj.value)
    })
  }

  test(`Should throw error on invalid key`, async () => {
    expect(() => new Authenticator('11223344556677AABBC')).toThrowError();
  })
})
