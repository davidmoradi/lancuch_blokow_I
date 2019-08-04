const Blockchain = require('./blockchain');

const kisacoin = new Blockchain;

kisacoin.createNewBlock(1234, 'OIEKJDS8783Jh', 'TWGSJS736S7DHAF');

kisacoin.createNewTransaction(12, 'DF82UWRH8AS', '83UERUASDIASDU');
kisacoin.createNewTransaction(4, 'DF82UWRH8AS', '83UERUASDIASDU');
kisacoin.createNewBlock(823, 'AWURHSAKJDA83', '834YRHASHJDJ9');

kisacoin.createNewTransaction(432, 'DF82UWRH8AS', '83UERUASDIASDU');
kisacoin.createNewTransaction(7, 'DF82UWRH8AS', '83UERUASDIASDU');
kisacoin.createNewTransaction(91283, 'DF82UWRH8AS', '83UERUASDIASDU');
kisacoin.createNewBlock(3831, '73RJAKSFH3DJD0', '2364TRGAHJSHF');

console.log(kisacoin);
