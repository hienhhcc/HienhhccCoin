import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import request from 'request';
import dotenv from 'dotenv';
import {
  BlockChain,
  PubSub,
  Wallet,
  TransactionPool,
  Transaction,
} from './classes';

const app = express();
const blockchain = new BlockChain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub(blockchain, transactionPool);

dotenv.config();

const DEFAULT_PORT = parseInt(process.env.PORT);
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/blocks', (req: Request, res: Response) => {
  res.json(blockchain.chain);
});

app.post('/mine-block', (req: Request, res: Response) => {
  const { data } = req.body;
  // Đào coin
  blockchain.addBlock(data);
  // Đào xong thì broadcast chain cho các node khác
  pubsub.broadcastChain();
  res.redirect('/blocks');
});

app.post('/transact', (req: Request, res: Response) => {
  const { amount, recipient } = req.body;
  let transaction: Transaction = transactionPool.existingTransaction(
    wallet.publicKey
  );
  try {
    if (transaction) {
      transaction.update(wallet, recipient, amount);
    } else {
      transaction = wallet.createTransaction(recipient, amount);
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);
  pubsub.broadcastTransaction(transaction);

  console.log('TransactionPool', transactionPool);
  res.json({ transaction });
});

app.post('/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

const syncWithRootNode = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      blockchain.replaceChain(rootChain);
    }
  });

  request(
    { url: `${ROOT_NODE_ADDRESS}/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          'replace transation pool map on a sync with',
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

let PEER_PORT;
console.log(process.env.GENERATE_PEER_PORT);
if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncWithRootNode();
  }
});
