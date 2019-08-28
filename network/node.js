const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');
const port = process.argv[2]; // get the passed-in port number from command line
const rp = require('request-promise');

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

app.post('/register-and-prodcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  if (!kisaCoin.networkNodes.includes(newNodeUrl)) {
    kisaCoin.networkNodes.push(newNodeUrl);
  }

  // loop through all existing nodes and register the new node
  let registerNodePromises = [];
  kisaCoin.networkNodes.forEach((networkNodeUrl) => {
    const registerNodeOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl },
      json: true
    }

    registerNodePromises.push(rp(registerNodeOptions));
  });

  Promise.all(registerNodePromises).then((data) =>
    const registerBulkOptions = {
      uri: newNodeUrl + '/register-node-in-bulk',
      body: { allNetworkNodes: kisaCoin.networkNodes },
      json: true
    };

    return rp(registerBulkOptions);
  }).then((data) => {
    res.json({ info: 'New node registered with the network successfully... such WOW!!!'})
  });

});

app.post('/register-node', (req, res) => {
  // Implement
});

app.post('/register-node-in-bulk', (req, res) => {
  // Implement
});

app.listen(port, () => {
  console.log(`listening on port ${port}!...`)
})
