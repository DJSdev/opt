import {
  padStart,
  hexConverter
} from '../src/utils';
 
describe('padStart', () => {
  test('padStart with string', () => {
    const value = padStart('test', 5, '0');
    expect(value).toBe('0test')
  });

  test('padStart with 0 string', () => {
    const value = padStart('1', 5, '0');
    expect(value).toBe('00001')
  });

  test('padStart with empty string', () => {
    const value = padStart('', 5, '0');
    expect(value).toBe('00000')
  });
});

describe('hexString getBuffer', () => {
  test('hexStringToBuffer with bd757ea0dc8b46b14f42dceb15a30cd9', () => {
    const value = hexConverter.getBuffer('bd757ea0dc8b46b14f42dceb15a30cd9');
    expect(value).toBeInstanceOf(Uint8Array);
  })

  test('hexString getBuffer with 00', () => {
    const value = hexConverter.getBuffer('00');
    expect(value).toBeInstanceOf(Uint8Array);
  })

  test('throw error with invalid hex string', () => {
    expect(() => hexConverter.getBuffer('0')).toThrowError();
  })
})