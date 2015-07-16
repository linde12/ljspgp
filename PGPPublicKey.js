var bignum = require('bignum'),
    MPI = require('./MPI'),
    base64_decode = require('base64').decode;

var RSAPublicKey = function (pKey) {
    this.read(base64_decode(pKey));
};

RSAPublicKey.prototype.read = function (pKey) {
    // What are the first two bytes?? Some sort of length?
    var pos = 2;

    this.version = pKey.charCodeAt(pos);
    pos++;

    if (this.version == 3 || this.version == 4) {
        this.createdBytes = pKey.substr(pos, 4);
        pos += 4;

        if (this.version == 3) {
            this.experiationTimeBytes = pKey.substr(pos, 2);
            pos += 2;
        }

        // 1 = encrypt_sign, 2 = encrypt, 3 = sign
        this.algorithm = pKey.charCodeAt(pos);
        pos++;

        // n, e
        var mpiCount = 2;

        var bMpi = pKey.substr(pos);
        var bPos = 0;
        this.mpi = [];

        for (var i = 0; i < mpiCount && bPos < bMpi.length; i++) {
            this.mpi[i] = new MPI();
            bPos += this.mpi[i].read(bMpi.substr(bPos));

            if (bPos > bMpi.length) {
                console.log(bPos, " > ", bMpi.length);
                throw new Error("Error reading MPI. Invalid/Unsupported format. Read more than the length of the MPI(s)");
            }
        }
    }
};

RSAPublicKey.prototype.getN = function () {
    return this.mpi[0].tobignum(); // First MPI is modulus
};

RSAPublicKey.prototype.getE = function () {
    return this.mpi[1].tobignum(); // Second MPI is exponent
};

RSAPublicKey.prototype.getVersion = function () {
    return this.version; // First octet is version
};

RSAPublicKey.prototype.getAlgorithm = function () {
    return this.algorithm; // Fifth/Seventh(depending on version) octet is algorithm
};

module.exports = RSAPublicKey;