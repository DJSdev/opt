import base32Decode from 'base32-decode';
import { Totp } from './totp';
import { HashAlgorithm, hexConverter } from './utils';

export class Authenticator extends Totp {
  constructor(secret: string) {
    const decodedSecret = hexConverter.getString(base32Decode(secret.toUpperCase(), 'RFC4648'));
    super(decodedSecret);
    this.setOptions({ algorithm: HashAlgorithm.SHA1, keyEncoding: 'hex' });
  }

  async generate(): Promise<string> {
    return await this.getTotpToken();
  }
}
