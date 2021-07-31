const { Certificate } = require('./x509')
const rawHash = require("sha256-uint8array").createHash;
const fs = require('fs');

const hcaTestCert = Certificate.fromPEM(fs.readFileSync('./dev_ec.cer'));

const fingerprint = rawHash().update(hcaTestCert.raw).digest();
const keyID = fingerprint.slice(0,8)

console.log(Buffer.from(keyID).toString('base64'))