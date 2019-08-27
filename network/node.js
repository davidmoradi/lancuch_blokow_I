const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');
const port = process.argv[2]; // get the passed-in port number from command line

const kisaCoin = new Blockchain();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello KisaCoin!')
});

app.get('/blockchain', (req, res) => {
  res.send(kisaCoin);
});

app.post('/transaction', (req, res) => {
  const blockIndex = kisaCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ info: `Tranaction will be mined in block number: ${blockIndex}`});
});

app.get('/mine', (req, res) => {
  const lastBlock = kisaCoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transaction: kisaCoin.pendingTransactions,
    index: kisaCoin.chain.length + 1
  }

  const nonce = kisaCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = kisaCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  // Mining reward
  kisaCoin.createNewTransaction(100, '00', 'recipientAddress')

  // Finally create the block
  const newBlock = kisaCoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    info: 'New block created such wow!!!',
    block: newBlock
  });

});

app.listen(port, () => {
  console.log(`listening on port ${port}!...`)
})
