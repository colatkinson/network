/* tslint:disable:no-unused-expression */

import {
    derSign,
    derVerify,
    genSignedMsg,
    verifySignedMsg,
    deriveSecret,
    genCert,
    privToPub,
} from '../src/cryptoFuncs';
import { expect } from 'chai';
import 'mocha';

const privkey = 'd90d421ede8fc45eda238650afd4d2f2fde3f83b1f3adf609cca7ccd157851e8';
const pubkey = '046ea7c4b3cb54ee855c958da1a2f95d7e7898045367da27b012184f288ca8ad2' +
               '279263df3a3ec7987e754b9adff37290941b31380869271d21ac999d2ef54fef9';

const privkey2 = '04c6b604f75ea695aebac2deb48eaa1223470e239cb0120dad57d72f34d69eff8' +
                 'd53cb7cfed328d909a10a65e6e291f42547429dce04840f2dfcb847699d4ce385';
const pubkey2 = '0464d73ea8d86d22fbe466d9c14c1343f4f6e398f91879b699c2ed4aaf53391e7' +
                '93b402a50f3fb0aea910a21ddafd218429d97b271539f6c42a614c4a201c571a2';

describe('Cryptographic Functions', () => {
    it('should deterministically sign data', () => {
        const result = derSign('hello, world!', privkey);
        expect(result).to.equal('3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                                'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e');
    });

    it('should verify signed data', () => {
        const sig = '3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                    'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e';
        const result = derVerify('hello, world!', pubkey, sig);
        expect(result).to.be.true;
    });

    it('should not verify a bad signature', () => {
        const sig = '3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                    'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e';
        const result = derVerify('vires in numeris', pubkey, sig);
        expect(result).to.be.false;
    });

    it('should successfully sign and then verify', () => {
        const sig = derSign('hunter2', privkey);
        const result = derVerify('hunter2', pubkey, sig);
        expect(result).to.be.true;
    });

    it('should correctly generate a signed message', () => {
        const sig = '3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                    'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e';

        const obj = genSignedMsg('hello, world!', privkey);

        const correct = {
            data: 'hello, world!',
            sig,
        };

        expect(obj).to.deep.equal(correct);
    });

    it('should correctly verify a signed message', () => {
        const sig = '3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                    'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e';

        const correct = {
            data: 'hello, world!',
            sig,
        };

        const result = verifySignedMsg(correct, pubkey);

        expect(result).to.be.true;
    });

    it('should not verify a bad signed message', () => {
        const sig = '3045022064ef8bd6c4f93237de2e7682a06c9a6b7aa65c78f427494d7a00605f4055d56' +
                    'e022100b3dd4c2a1ac002ce98c3921883c0772893d56383b12995a97430a461828ef81e';

        const correct = {
            data: 'bounjour, monde!',
            sig,
        };

        const result = verifySignedMsg(correct, pubkey);

        expect(result).to.be.false;
    });

    it('should correctly derive a secret', () => {
        const secret1 = deriveSecret(privkey, pubkey2);
        const secret2 = deriveSecret(privkey2, pubkey);

        expect(secret1).to.equal(secret2);
    });

    it('should correctly generate certificates', () => {
        const tuple = genCert('asdf', 'ghjk', privkey, '127.0.0.1:8000');
        const cert = tuple[0];
        const tmpPrivkey = tuple[1];

        const pub = privToPub(tmpPrivkey);

        const obj = {
            challenge: 'ghjk',
            name: 'asdf',
            pubkey,
            timestamp: cert.timestamp,
            tmpPubKey: pub,
            version: '1.0.0',
            addr: '127.0.0.1:8000',
        };

        expect(cert).to.deep.equal(obj);
    });
});
