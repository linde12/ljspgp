var bignum = require('bignum'),
    getPem = require('./rsaPublicKeyPem'),
    PGPPublicKey = require('./PGPPublicKey'),
    openpgp = require('openpgp');

var PGP = function (rsaKey) {

    if (rsaKey) {
        this.n = rsaKey.getN();
        this.e = rsaKey.getE();
    }

    this.getTotient = function (prime1, prime2) {
        return (prime1.sub(1)).mul(prime2.sub(1));
    };

    /**
     * Coprime number with t that matches 1 < e < t
     * @param  {[type]} totient [description]
     * @return {[type]}         [description]
     */
    this.computeE = function (totient, n) {
        for (var i = bignum('2'); i.lt(totient); i = i.add(1)) {
            if (totient.gcd(i).eq(1)) {
                return i;
            }
            /*if (!totient.mod(i).eq(0) && i.probPrime() === true) {
                return i;
            }*/
        }
    };

    /**
     * Modular multiplicative inverse of e
     * @return {[type]} [description]
     */
    this.computeD = function (totient, e) {
        var k = bignum('1');
        while (true) {
            k = k.add(totient);
            if (k.mod(e).eq(0)) {
                return k.div(e);
            }
        }
    };

    this.encrypt = function (message, publicKey) {
        if (publicKey) {
            this.n = publicKey.n;
            this.e = publicKey.e;
        }

        console.log("n = ", this.n);
        var cipher = [];
        for (var i = 0; i < message.length; i++) {
            cipher.push(bignum(message.charCodeAt(i)).powm(this.e, this.n));
        }
        
        return cipher;
    };

    this.decrypt = function (buffer, privateKey) {
        var plain = "";
        for (var i = 0; i < buffer.length; i++) {
            plain += String.fromCharCode(bignum(buffer[i]).powm(privateKey.d, privateKey.n).toString());
        }

        return plain;
    };

    this.createRSA = function (prime1, prime2) {
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
    };
};

var pub = new PGPPublicKey("mI0EVadgigEEAK56HBeO5KdOJhOSdOq4JkucNYXPkVG2N4AKANngvWxcH5JEwpjq\nP8gmvphs9PNevVtZcFRt+fadcOjnLfaTZ+FP5Rnx20BW4oHqK1wmJVHb1f0VfPML\nLa9JH+5gDs7Trg7HksvxDc4Fy+Z7DH/z5llsrPayFxgnc7c1Pm4zquRfABEBAAG0\nHGxpbmRlIDxsaW5kZW9zY2FyQGdtYWlsLmNvbT6IuAQTAQIAIgUCVadgigIbAwYL\nCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ5zs+ntBoI9pQBQP/WWoc3hFJq8gW\nec/YlBnTtDR5wHCC4khdfxtmJAyQF3LbtWg3NWbwWJQA8dPgOdWWWB7Jme4yALq0\nMQS1m6vMGx/uydgvLy005T7l6zJwFFELe2qML19iDEG7lOa0B0x8gcgxLcpWjhho\nWcRj6iz8qHiN4gX21slybI1KaiGXnXC4jQRVp2CKAQQA6Vd1tT0oXT9OLps5Fc49\nCS26pYP5+e+wzH0oykRFhmZcpfGKyACmGvOfNZHeNIZtPF4BqHVELlwtbpedKhph\n+edgnFv8ZS/kw/iWVPooRn5iS2VSrUd377tibJjA6veBtsgkiO+FN6n04nuyGg/+\nydCqLk4OIU7ql80WrFEf0h0AEQEAAYifBBgBAgAJBQJVp2CKAhsMAAoJEOc7Pp7Q\naCPa5EYEAIEKL9w0a5UoCcaqXK6RRRKNt9bvGzJsRy6ktN3rfZhuk+jOe2Y244BL\nQ5I06pLmycxAsZFIPobI2nB1azBdsdHi4SUaiX9+CqMgV8LhiHDQZosUnzfsm7a3\nvx1DI6pljA+jxcBUHN0y16TwzIXjO7lcpxhcGAmyJHOezYokQaMB\n=aRhg");

console.log("PGP Version: ", pub.getVersion());
console.log("PGP algorithm: ", pub.getAlgorithm());
console.log("PGP exponent: ", pub.getE().toString());
console.log("PGP modulus: ", pub.getN().toString());

// Encryption works, but doesnt base64 encode & armor

// TODO: Armored output from encryption
// TODO: PGPPrivateKey
// TODO: Decryption of armored message
// TODO: Signing of message

//var pgp = new PGP(pub);
//var message = "A";
//var encrypted = pgp.encrypt(message);
//console.log(encrypted);