<h1 align="center">Network</h1>

<p align="center"><b>Basically an unnecessary reimplementation of TLS</b></p>

<p align="center">
    <a href="https://travis-ci.org/colatkinson/network">
        <img src="https://img.shields.io/travis/colatkinson/network.svg?style=flat-square" alt="Travis" />
    </a>
    <a href="https://codecov.io/gh/colatkinson/network">
        <img src="https://img.shields.io/codecov/c/github/colatkinson/network.svg?style=flat-square" alt="Codecov" />
    </a>
</p>

## What even is this?

Each machine in the network has an associated [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) keypair. When a device wants to connect, it negotiates an [ECDHE](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) secret. This prevents any snooping from outside.

Once a connection is established, the devices form a gossip network, passing arbitrary messages between participants. These can be public (e.g. connection status), or private (e.g. a personal message). In the latter case, ECDH will be used to securely encrypt the contents.

## Why?

I wanted to mess around with cryptographic primitives. Also I wanted to make a cool, cypherpunk network.

## Installation

```bash
yarn
yarn start
```

## Disclosure Policy

Please do not contact any contributors privately to disclose a bug. Make an issue so that this is immediately brought to light.

## Technologies Used

* Typescript
* ZeroMQ for socket communication
* Redux for state management
* Mocha for testing
