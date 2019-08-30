const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');
const port = process.argv[2]; // get the passed-in port number from command line
const rp = require('request-promise');
const uuid = require('uuid/v1');
const nodeAddress = uuid().replace(/-/gi, "");

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
  const newTransaction = req.body;
  const blockIndex = kisaCoin.addTransactionToPendingTransactions(newTransaction);
  console.log(`Recieved a new transaction!.. It will be added in block number: ${blockIndex}`);
  res.json({ info: `Tranaction will be mined in block number: ${blockIndex}`});
});

app.post('/transaction/broadcast', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const newTransaction = kisaCoin.createNewTransaction(amount, sender, recipient);
  const blockIndex = kisaCoin.addTransactionToPendingTransactions(newTransaction);

  let transactionPromises = []
  kisaCoin.networkNodes.forEach((networkNodeUrl) => {
    const options = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    }

    transactionPromises.push(rp(options));
  });

  Promise.all(transactionPromises).then(data => {
    res.json({ info: 'transaction created and broadcasted successfully...'});
  })
});

app.get('/mine', (req, res) => {
  const lastBlock = kisaCoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: kisaCoin.pendingTransactions,
    index: kisaCoin.chain.length + 1
  }

  const nonce = kisaCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = kisaCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  // Finally create the block
  const newBlock = kisaCoin.createNewBlock(nonce, previousBlockHash, blockHash);

  // Broadcast this newBlock to other nodes on the network
  let newBlockPromises = [];
  kisaCoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/recieve-new-block',
      method: 'POST',
      body: { newBlock },
      json: true
    }

    newBlockPromises.push(rp(requestOptions));

  });

  Promise.all(newBlockPromises).then((data) => {
    // Now that the new block is created and broadcaste to other nodes,
    // create a mining reward transaction for this node and broadcast it
    const miningRewardTransactionOptions = { amount: 100, sender: '00', recipient: nodeAddress }
    const requestOptions = {
      uri: kisaCoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: miningRewardTransactionOptions,
      json: true
    }

    return rp(requestOptions);
  }).then((data) => {
    res.json({
      info: 'New block created such wow!!!',
      block: newBlock
    });
  });
});

app.post('/recieve-new-block', (req, res) => {
  const newBlock = req.body.newBlock;

  // Series of checks
  const lastBlock = kisaCoin.getLastBlock()
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] === newBlock['index'] - 1

  if (correctHash && correctIndex) {
    kisaCoin.chain.push(newBlock);
    kisaCoin.pendingTransactions = []; // empty pending transactions because they are now added to the new block
    res.json({ info: 'new block received and accepted. yay!', newBlock: newBlock })
  } else {
    res.json({ info: 'new block rejected. You dun goofed!!!', newBlock: newBlock })
  }
});

app.post('/register-and-broadcast-node', (req, res) => {
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

    registerNodePromises.push(
      rp(registerNodeOptions).catch((err) => {
        console.log(err)
      })
    );
  });

  Promise.all(registerNodePromises).then((data) => {
    const registerBulkOptions = {
      uri: newNodeUrl + '/register-node-in-bulk',
      method: 'POST',
      body: { allNetworkNodes: [ ...kisaCoin.networkNodes, kisaCoin.currentNodeUrl ] },
      json: true
    };

    rp(registerBulkOptions).catch((err) => {
      console.log(err)
    })
  }).then((data) => {
    res.json({ info: 'New node registered with the network successfully... such WOW!!!'})
  }).catch((err) => {
    console.log(err);
  });
});

app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeAlreadyExist = kisaCoin.networkNodes.includes(newNodeUrl);
  const isCurrentNode = kisaCoin.currentNodeUrl === newNodeUrl;

  if (!nodeAlreadyExist && !isCurrentNode) kisaCoin.networkNodes.push(newNodeUrl);

  res.json({ info: 'Node registerd successfully... such WOW!!!'})
});

app.post('/register-node-in-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach((networkNodes) => {
    const nodeAlreadyExist = kisaCoin.networkNodes.includes(networkNodes);
    const isCurrentNode = kisaCoin.currentNodeUrl === networkNodes;
    if (!nodeAlreadyExist && !isCurrentNode) kisaCoin.networkNodes.push(networkNodes);
  });

  res.json({ info: "Bulk registration successful..."})
});

app.listen(port, () => {
  console.log(`listening on port ${port}!...`)
})
