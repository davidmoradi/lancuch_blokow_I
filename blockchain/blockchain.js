const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(100, '0', '0'); // Genesis Block
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  }

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid().replace(/-/gi, "")
  }

  return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
  this.pendingTransactions.push(transactionObj);

  // The index of the block that this transaction would be added in.
  // meaning this new transaction would be mined in the next block.
  return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);

  return hash;
}

// Repeatedly hash block until it finds the correct hash => '0000........'
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  while (hash.substring(0,4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain) {
  let validChain = true;

  for (var i = 1; i < blockchain.length; i++) {
    // check 1: make sure blocks match with their previous block
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];
    if (currentBlock.previousBlockHash !== previousBlock['hash']) validChain = false;

    // Check 2: hash every block and make sure it starts with 0000
    const currentBlockData = {
      transactions: currentBlock['transactions'],
      index: currentBlock['index']
    }

    let hash = this.hashBlock(
      previousBlock['hash'],
      currentBlockData,
      currentBlock['nonce']
    );

    if (hash.substring(0, 4) !== '0000') validChain = false;
  }

  // Genesis block validation
  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock['nonce'] === 100;
  const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
  const correctHash = genesisBlock['hash'] === '0'
  const correctTransactionCount = genesisBlock.transactions.length === 0;

  if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactionCount) {
    validChain = false;
  }

  return validChain;
}

module.exports = Blockchain;
