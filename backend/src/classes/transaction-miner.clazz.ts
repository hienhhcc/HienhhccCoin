import {
  BlockChain,
  TransactionPool,
  Wallet,
  PubSub,
  Transaction,
} from './index';

export class TransactionMiner {
  constructor(
    public blockchain: BlockChain,
    public transactionPool: TransactionPool,
    public wallet: Wallet,
    public pubsub: PubSub
  ) {}

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet));
    this.blockchain.addBlock(validTransactions);
    this.pubsub.broadcastChain();
    this.transactionPool.clear();
  }
}
