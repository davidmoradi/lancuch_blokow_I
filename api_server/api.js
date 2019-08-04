const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');

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

app.get('/mine', (req, res) => {});

app.listen(port, () => {
  console.log(`listening on port ${port}!...`)
})
