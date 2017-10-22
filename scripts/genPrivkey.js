#!/bin/env node
const elliptic = require('elliptic');

const EC = elliptic.ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();

console.log(key.getPrivate().toString('hex'));
