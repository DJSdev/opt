# What is this?

This is an One-Time-Password library that can be used to generate OTP/MFA codes in both a browser and nodejs.

## ✨ Usage

```ts
// MFA Authenticator
const auth = new Authenticator('RWMA7T7LRRIYFFHYMKWR2ITQJK346XI2KE4SLKHV7HIW5JXBYFWHX3NCBNO75TOH')
console.log(await auth.generate())
> Output: 267634

// TOTP
const t = new Totp('RWMA7T7LRRIYFFHYMKWR2ITQJK346XI2KE4SLKHV7HIW5JXBYFWHX3NCBNO75TOH')
console.log(await t.generate());
> Output: 324278

// HOTP
const h = new Hotp('RWMA7T7LRRIYFFHYMKWR2ITQJK346XI2KE4SLKHV7HIW5JXBYFWHX3NCBNO75TOH')
console.log(await h.generate());
> Output: 690691
```

## 🏦 Building
```sh
npm run build
```

## 🧪 Testing
```sh
npm test
```