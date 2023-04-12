export type HexString = string;

export type Encoding = 'ascii' | 'hex' | 'base32' ;

export enum HashAlgorithm {
  SHA1 = 'SHA-1',
  SHA256 = 'SHA-256',
  SHA512 = 'SHA-512'
}

export interface Converter {
  getBuffer(data: string): Uint8Array;
  getString(data: ArrayBuffer): string;
}

export interface OtpOptions {
  counter: number;
  algorithm: HashAlgorithm;
  keyEncoding: Encoding; 
}

export interface Otp {
  generate(): Promise<string>;
  setSecret(secret: string): Otp;
  setOptions(options: Partial<OtpOptions>): Otp;
}

export const hexConverter: Converter = {
  /**
   * Converts a hex string to an Uint8Array
   * 
   * @param data Hex String - could be a hex string of an HMAC Digest
   * @returns Uint8Array
   */
  getBuffer: (data: string): Uint8Array => {
    if (data.length % 2 !== 0) {
      // If there are an odd number of digits, it's not a valid hex char, so we drop it off the end
      // Otherwise the key buffer will have a zero at the end
      // data = data.slice(0, data.length - 1)
      throw new Error(`Not a valid hex key length - key length ${data.length}`);
    }

    const typedArray = new Uint8Array(Math.ceil(data.length / 2));

    // .match(/../g) puts two chars per array entry from the string
    // The 2 digits represent a hex value and are parsed to a base 16 integer and added to the typed array
    typedArray.set(data.match(/../g)!.map((_, index) => parseInt(data.substr(index * 2, 2), 16)));
  
    return typedArray;
  },

  /**
   * Takes an ArrayBuffer and converts it to a hex string
   * 
   * The NodeJS equivalent is `Buffer.from(data).toString('hex')`
   * @param arrayBuffer base32 encoded secret string
   * @returns decoded hex string
   */
  getString(arrayBuffer: ArrayBuffer): string {
    const hexString = Array.from(new Uint8Array(arrayBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    return hexString;
  }
}

export const asciiConverter: Converter = {
  getBuffer(data: string): Uint8Array {
    const typedArray = new Uint8Array(Math.ceil(data.length));
    typedArray.set(data.split('').map((_, index) => data.charCodeAt(index)));

    return typedArray;
  },

  getString(arrayBuffer: ArrayBuffer): string {
    const array = new Uint8Array(arrayBuffer)
    return String.fromCharCode(...array);
  }
}

/**
 * Take string and pad start with `fillString`
 */
export function padStart(value: string, maxLength: number, fillString: string): string {
  if (value.length >= maxLength) {
    return value;
  }
  
  // Create empty array
  const test = [...Array(maxLength + 1)]

  // Fill with all zeros. Leave space at end for value
  test.fill(fillString, 0, maxLength - value.length);

  // For every char, append to array
  value.split('').forEach(char => test.push(char));

  // return joined array
  return test.join('');
}