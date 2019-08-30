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

const previousBlockHash = '23U4ERHFAKS83RUFA';
const currentBlockData = [
  {
    amount: 231,
    sender: '1293IEJFSASDJASD',
    recipient: '923JFKASHD16D'
  },
  {
    amount: 14,
    sender: '12U8WSDIJASDHHF',
    recipient: '182WYEHDAJSDH'
  },
  {
    amount: 749,
    sender: '0128UEWJAKSNVX',
    recipient: 'CNIQW7E7YDHASD'
  },
]

console.log(kisacoin.proofOfWork(previousBlockHash, currentBlockData));

let hash = kisacoin.hashBlock(previousBlockHash, currentBlockData, 67441);

console.log(hash);

const mockBlockchain = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1567159645918,
      "transactions": [],
      "nonce": 100,
      "hash": "0",
      "previousBlockHash": "0"
    },
    {
      "index": 2,
      "timestamp": 1567159745903,
      "transactions": [
        {
          "amount": 82,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "22880130cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 10,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "28724970cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 20,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "2b780f60cb0e11e9819d833afdc01c50"
        }
      ],
      "nonce": 37571,
      "hash": "00006c7fbc5cf1878733d68ef9a232ca41199ea7884699a5bbd7eadeb432b277",
      "previousBlockHash": "0"
    },
    {
      "index": 3,
      "timestamp": 1567159793172,
      "transactions": [
        {
          "amount": 100,
          "sender": "00",
          "recipient": "f7847fe0cb0d11e9819d833afdc01c50",
          "transactionId": "331dea50cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 30,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "3c134fb0cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 40,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "3f4555c0cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 50,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "44886180cb0e11e9819d833afdc01c50"
        }
      ],
      "nonce": 240735,
      "hash": "00002f939fe96c7c5c2246e6d553e853b93076ef22d063650b68fa95517db18a",
      "previousBlockHash": "00006c7fbc5cf1878733d68ef9a232ca41199ea7884699a5bbd7eadeb432b277"
    },
    {
      "index": 4,
      "timestamp": 1567159817022,
      "transactions": [
        {
          "amount": 100,
          "sender": "00",
          "recipient": "f7847fe0cb0d11e9819d833afdc01c50",
          "transactionId": "4f4a2270cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 60,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "518d82c0cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 70,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "54842d80cb0e11e9819d833afdc01c50"
        },
        {
          "amount": 70,
          "sender": "ko23UERJASDHF83J",
          "recipient": "777JAS82UHEFDJASD",
          "transactionId": "5b9e6a40cb0e11e9819d833afdc01c50"
        }
      ],
      "nonce": 15690,
      "hash": "0000af4e11dd9e16819774c45e72b13052559bb59bd96e262ea379199585d8e2",
      "previousBlockHash": "00002f939fe96c7c5c2246e6d553e853b93076ef22d063650b68fa95517db18a"
    }
  ],
  "pendingTransactions": [
    {
      "amount": 100,
      "sender": "00",
      "recipient": "f7847fe0cb0d11e9819d833afdc01c50",
      "transactionId": "5d81a930cb0e11e9819d833afdc01c50"
    },
    {
      "amount": 80,
      "sender": "ko23UERJASDHF83J",
      "recipient": "777JAS82UHEFDJASD",
      "transactionId": "62ebec00cb0e11e9819d833afdc01c50"
    }
  ],
  "currentNodeUrl": "http://127.0.0.1:3001",
  "networkNodes": []
}

console.log("Chain is valid: ", kisacoin.chainIsValid(mockBlockchain.chain))
