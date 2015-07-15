var bignum = require('bignum');

var RSAPublicKey = function (pKey) {
    var API = {};

    var pKeyBuffer = new Buffer(pKey, 'base64');

    var decoded = new Buffer(pKeyBuffer.toString(), 'binary');

    var decodedString = decoded.toString();

    var keyLength = Math.floor((decodedString.charCodeAt(0) * 256 + decodedString.charCodeAt(1) + 7) / 8);
    
    var modulusBuffer = new Buffer(keyLength + 2);
    decoded.copy(modulusBuffer, 0, 0, keyLength + 2);
    var n = bignum.fromBuffer(modulusBuffer);//bignum(decoded.substr(0, keyLength + 2));

    console.log(modulusBuffer);
    console.log("n = ", n.toString());
    return API;
};

module.exports = RSAPublicKey;