import {
  HexString,
  OtpOptions,
  Otp,
  HashAlgorithm
} from "./utils";
import { Hotp } from './hotp';

export type TotpOptions = OtpOptions & { step: 30 | 60, digits: 6 | 8 };

export class Totp extends Hotp {
  private totpOptions: TotpOptions;

  constructor(secret: HexString) {
    super(secret);
    this.totpOptions = this.defaultOptions() as TotpOptions;
  }

  public setOptions(totpOptions: Partial<TotpOptions>): Otp {
    if (totpOptions.algorithm) {
      this.totpOptions.algorithm = totpOptions.algorithm;
    }

    if (totpOptions.counter) {
      this.totpOptions.counter = totpOptions.counter;
    }

    if (totpOptions.keyEncoding) {
      this.totpOptions.keyEncoding = totpOptions.keyEncoding;
    }

    return this
  }

  public setSecret(secret: HexString): Otp {
    this.secret = secret;

    return this
  }

  public async generate(): Promise<string> {
    if (!this.totpOptions.counter) {
      this.totpOptions.counter = Date.now();
    }
    const totpSecret = this.getTotpSecret();
    const counter = this.getTotpCounter(this.totpOptions.counter, this.totpOptions.step);
    const digest = await this.hmacDigest(totpSecret, counter, this.totpOptions.algorithm, this.totpOptions.keyEncoding);

    return this.hotpDigestToToken(digest, 6);
  }

  protected defaultOptions(): Partial<TotpOptions> {
    return {
      counter: Date.now(),
      algorithm: HashAlgorithm.SHA1,
      keyEncoding: 'ascii',
      step: 30,
      digits: 6
    }
  }

  protected getTotpCounter(counter: number, step: 30 | 60): string {
    const counterNum = Math.floor(counter / step / 1000);

    return this.getHotpCounter(counterNum);
  }

  private getTotpSecret(): string {
    switch (this.totpOptions.algorithm) {
      case (HashAlgorithm.SHA1):
        return this.padTotpSecret(this.secret, 20);
      case (HashAlgorithm.SHA256):
        return this.padTotpSecret(this.secret, 32);
      case (HashAlgorithm.SHA512):
        return this.padTotpSecret(this.secret, 64);
      default:
        throw new Error('Hash algorithm not implemented')
    }
  }

  /**
   * When the secret doesn't meet the minimum length requirements for HMAC, we need to pad up the secret
   * 
   * This function effectively concats the secret to itself until it's long enough. Then it's trimmed to the minimum length
   */
  private padTotpSecret(secret: string, minLength: number): string {    
    if (secret.length < minLength) {
      // figure out how many times the buffer and fit into the minimum byte length
      const quotient = Math.ceil(minLength / secret.length);

      const keyConverter = this.getKeyConverter(this.totpOptions.keyEncoding);
      const buffer = keyConverter.getBuffer(secret);

      // crete a buffer based on quotient to meet minimum byte length
      let newSecretArray = new Uint8Array(buffer.length * quotient);
      
      for (let i = 0; i < quotient; i++) {
        newSecretArray.set(buffer, buffer.length * i);
      }

      // Trim off excess to minimum length
      return keyConverter.getString(newSecretArray.slice(0, minLength));
    }

    return this.secret;
  }
}

