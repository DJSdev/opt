import {
  Encoding,
  HexString,
  OtpOptions,
  hexConverter,
  padStart,
  Otp,
  asciiConverter,
  HashAlgorithm,
} from "./utils";
import crypto from 'crypto'

type HotpOptions = OtpOptions;

export class Hotp implements Otp {
  private hotpOptions: HotpOptions;

  constructor(protected secret: HexString) {
    this.hotpOptions = this.defaultOptions() as HotpOptions;
  }

  public setOptions(hotpOptions: Partial<HotpOptions>): Otp {
    if (hotpOptions.algorithm) {
      this.hotpOptions.algorithm = hotpOptions.algorithm;
    }

    if (hotpOptions.counter) {
      this.hotpOptions.counter = hotpOptions.counter;
    }

    if (hotpOptions.keyEncoding) {
      this.hotpOptions.keyEncoding = hotpOptions.keyEncoding;
    }

    return this
  }

  public setSecret(secret: HexString): Otp {
    this.secret = secret;

    return this
  }

  public async generate(): Promise<string> {
    const counter = this.getHotpCounter(this.hotpOptions.counter)
    const hexDigest = await this.hmacDigest(this.secret, counter, this.hotpOptions.algorithm, this.hotpOptions.keyEncoding);

    return this.hotpDigestToToken(hexDigest, 6);
  }

  protected async hmacDigest(secret: string, counter: string, algorithm: HashAlgorithm, encoding: Encoding): Promise<string> {

    const keyConverter = this.getKeyConverter(encoding);

    const asdf = keyConverter.getBuffer(secret)

    // Generate HMAC Key
    const key = await crypto.subtle.importKey(
      'raw',
      keyConverter.getBuffer(secret),
      { name: 'HMAC', hash: algorithm },
      true,
      ['sign', 'verify']
    );
  
    const tet = hexConverter.getBuffer(counter)

    // create HMAC digest buffer 
    const digestBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      hexConverter.getBuffer(counter)
    );
  
    return hexConverter.getString(digestBuffer)
  }

  protected hotpDigestToToken(hexDigest: string, digits: 6 | 8): string {
    const digest = hexConverter.getBuffer(hexDigest);
    const offset = digest[digest.length - 1] & 0xf;
    const binary =
      ((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff);
  
    const token = binary % Math.pow(10, digits);
    return padStart(String(token), digits, '0');
  }

  protected defaultOptions(): Partial<HotpOptions> {
    const counter = 0;
    return {
      counter: counter,
      algorithm: HashAlgorithm.SHA1,
      keyEncoding: 'ascii'
    }
  }

  protected getKeyConverter(encoding: Encoding) {
    switch (encoding) {
      case 'ascii':
        return asciiConverter
      case 'hex': 
        return hexConverter
      case 'base32':
        return hexConverter
      default:
        throw new Error(`Encoding ${encoding} not recognized`)
    };
  }

  protected getHotpCounter(counter: number): string {
    const counterNum = counter.toString(16);

    return padStart(counterNum, 16, '0');
  }
}
