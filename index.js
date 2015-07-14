var bignum = require('bignum'),
    getPem = require('./rsaPublicKeyPem');

var RSA = function () {

    var API = {
        isPrime: function (number) {
            var sqRoot = Math.sqrt(number);
            for (var i = 2; i <= sqRoot; i++) {
                if (number % i == 0) {
                    return false;
                }
            }
            return true;
        },

        getTotient: function (prime1, prime2) {
            return (prime1.sub(1)).mul(prime2.sub(1));
        },

        /**
         * Coprime number with t that matches 1 < e < t
         * @param  {[type]} totient [description]
         * @return {[type]}         [description]
         */
        computeE: function (totient, n) {
            for (var i = bignum('2'); i.lt(totient); i = i.add(1)) {
                if (totient.gcd(i).eq(1)) {
                    return i;
                }
                /*if (!totient.mod(i).eq(0) && i.probPrime() === true) {
                    return i;
                }*/
            }
        },

        /**
         * Modular multiplicative inverse of e
         * @return {[type]} [description]
         */
        computeD: function (totient, e) {
            var k = bignum('1');
            while (true) {
                k = k.add(totient);
                if (k.mod(e).eq(0)) {
                    return k.div(e);
                }
            }
        },

        encrypt: function (message, publicKey) {
            var cipher = [];
            for (var i = 0; i < message.length; i++) {
                cipher.push(bignum(message.charCodeAt(i)).powm(publicKey.e, publicKey.n));
            }
            
            return cipher;
        },

        decrypt: function (buffer, privateKey) {
            var plain = "";
            for (var i = 0; i < buffer.length; i++) {
                plain += String.fromCharCode(bignum(buffer[i]).powm(privateKey.d, privateKey.n).toString());
            }

            return plain;
        },

        createRSA: function (prime1, prime2) {
            var n = prime1.mul(prime2);
            var totient = this.getTotient(prime1, prime2);
            var e = this.computeE(totient);
            var d = this.computeD(totient, e);

            console.log("p: ", prime1.toString());
            console.log("q: ", prime2.toString());
            console.log("n: ", n.toString());
            console.log("totient: ", totient.toString());
            console.log("e: ", e.toString());
            console.log("d: ", d.toString());

            return {
                publicKey: {
                    n: n,
                    e: e
                },
                privateKey: {
                    n: n,
                    d: d
                }
            };
        }

    };

    return API;
};

var rsa = new RSA();

var keypair = rsa.createRSA(bignum.prime(512), bignum.prime(512));
console.log("bitLength = " + keypair.publicKey.n.bitLength());

var n = keypair.publicKey.n; // .toBuffer().toString('base64');
var e = keypair.publicKey.e; // .toBuffer().toString('base64');

console.log(getPem(n.toBuffer().toString('base64'), e.toBuffer().toString('base64')));

var c = rsa.encrypt("kingkaew", keypair.publicKey);
console.log(c);
console.log("decrypted: ", rsa.decrypt(c, keypair.privateKey));