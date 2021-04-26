import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import request, { RequestCallback } from 'request';
import dotenv from 'dotenv';
import BlockChain from './classes/blockchain.clazz';
import PubSub from './classes/pubsub.clazz';

const app = express();
const blockchain = new BlockChain();
const pubsub = new PubSub(blockchain);

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

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      blockchain.replaceChain(rootChain);
    }
  });
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
    syncChains();
  }
});
