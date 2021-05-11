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
  TransactionMiner,
} from './classes';

const app = express();
const blockchain = new BlockChain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub(blockchain, transactionPool);
const transactionMiner = new TransactionMiner(
  blockchain,
  transactionPool,
  wallet,
  pubsub
);

dotenv.config();

const DEFAULT_PORT = parseInt(process.env.PORT);
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/blocks', (req: Request, res: Response) => {
  res.json({ blocks: blockchain.chain });
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
      transaction = wallet.createTransaction(
        recipient,
        amount,
        blockchain.chain
      );
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);
  pubsub.broadcastTransaction(transaction);

  console.log('TransactionPool', transactionPool);
  res.json({ transaction: transaction, type: 'success' });
});

app.get('/transaction-pool-map', (req, res) => {
  res.json({ transactionPoolMap: transactionPool.transactionMap });
});

app.get('/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/blocks');
});

app.get('/wallet-info', (req, res) => {
  const address = wallet.publicKey;
  res.json({
    address,
    balance: Wallet.calculateBalance(blockchain.chain, address),
  });
});

const syncWithRootNode = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      blockchain.replaceChain(rootChain, true, () => {});
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

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet: Wallet, recipient, amount }) => {
  const transaction = wallet.createTransaction(
    recipient,
    amount,
    blockchain.chain
  );

  transactionPool.setTransaction(transaction);
};

const walletAction = () =>
  generateWalletTransaction({
    wallet,
    recipient: walletFoo.publicKey,
    amount: 5,
  });

const walletFooAction = () =>
  generateWalletTransaction({
    wallet: walletFoo,
    recipient: walletBar.publicKey,
    amount: 10,
  });

const walletBarAction = () =>
  generateWalletTransaction({
    wallet: walletBar,
    recipient: walletBar.publicKey,
    amount: 15,
  });

for (let i = 0; i < 10; i++) {
  if (i % 3 === 0) {
    walletAction();
    walletFooAction();
  } else if (i % 3 === 1) {
    walletAction();
    walletBarAction();
  } else {
    walletFooAction();
    walletBarAction();
  }

  transactionMiner.mineTransactions();
}

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
