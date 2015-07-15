var bignum = require('bignum');
var base64_decode = require('base64').decode;

function mpi2b(s)
{
 var bn=1, r=[0], rn=0, sb=256;
 var c, sn=s.length;
 if(sn < 2)
 {
    alert('string too short, not a MPI');
    return 0;
 }

 var len=(sn-2)*8;
 var bits=s.charCodeAt(0)*256+s.charCodeAt(1);
 if(bits > len || bits < len-8) 
 {
    alert('not a MPI, bits='+bits+",len="+len);
    return 0;
 }

 for(var n=0; n<len; n++)
 {
  if((sb<<=1) > 255)
  {
   sb=1; c=s.charCodeAt(--sn);
  }
  if(bn > bm)
  {
   bn=1;
   r[++rn]=0;
  }
  if(c & sb) r[rn]|=bn;
  bn<<=1;
 }
 return r;
}

function b2mpi(b)
{
 var bn=1, bc=0, r=[0], rb=1, rn=0;
 var bits=b.length*bs;
 var n, rr='';

 for(n=0; n<bits; n++)
 {
  if(b[bc] & bn) r[rn]|=rb;
  if((rb<<=1) > 255)
  {
   rb=1; r[++rn]=0;
  }
  if((bn<<=1) > bm)
  {
   bn=1; bc++;
  }
 }
}

var bm = 268435455;
var pkey = "BADelitpUqMZLn+bryZR5rK9J3eu+pRVFP5tpboOlIwO2vqO/rCi8VvT2TPzEJarWhyZ465NIohYCiia9vaGUEp4rsDzFnVNgpON47yPew1zCmOOofituf+X6Qlaxylm5NnO4vnRcmoF4IbGwSCqyGgGor29D75Hovwlj1q6BWHYWwAGKQ==";
var mod = [];

var s = base64_decode(pkey);
var mpiLength = s.charCodeAt(0) + s.charCodeAt(1); // Length, in bits, for each MPI number
var mpiSize = Math.floor((mpiLength * 256 + 7) / 8) + 2; // Size of the entire MPI
console.log("mpiLength = " + mpiLength + ", mpiSize = " + mpiSize);
console.log(s.charCodeAt(0)*256 + s.charCodeAt(1)); // 2^8 = 256. We want the value in bytes, not bits

console.log(mpi2b(s.substr(0, mpiSize)));
console.log(bignum.fromBuffer(new Buffer(s.substr(2, mpiSize))));

//var mpiLength = ((s.charCodeAt(0)*256 + s.charCodeAt(1)+7)/8) + 2;
//var buf = new Buffer(textMPI.substr(0, testLength));
//console.log(buf.toString('hex'));