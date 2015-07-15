var bignum = require('bignum'),
    getPem = require('./rsaPublicKeyPem'),
    RSAPublicKey = require('./RSAPublicKey');

var RSA = function () {

    var API = {
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
                // Modulus
                n: n,
                // Public exponent(encryption key)
                e: e,
                // Private exponent(decryption key)
                d: d
            };
        }

    };

    return API;
};

console.log(new Buffer("b3NjYXI=", 'base64').toString());

var pub = new RSAPublicKey("BADelitpUqMZLn+bryZR5rK9J3eu+pRVFP5tpboOlIwO2vqO/rCi8VvT2TPzEJarWhyZ465NIohYCiia9vaGUEp4rsDzFnVNgpON47yPew1zCmOOofituf+X6Qlaxylm5NnO4vnRcmoF4IbGwSCqyGgGor29D75Hovwlj1q6BWHYWwAGKQ==");

/*
var rsa = new RSA();

var keypair = rsa.createRSA(bignum.prime(512), bignum.prime(512));
console.log("bitLength = " + keypair.n.bitLength());

var n = keypair.n; // .toBuffer().toString('base64');
var e = keypair.e; // .toBuffer().toString('base64');

var publicKey = {
    n: keypair.n,
    e: keypair.e
};

var privateKey = {
    n: keypair.n,
    d: keypair.d
};

console.log(getPem(n.toBuffer().toString('base64'), e.toBuffer().toString('base64')));

var c = rsa.encrypt("kingkaew", publicKey);
//console.log(c);
console.log("decrypted: ", rsa.decrypt(c, privateKey));*/