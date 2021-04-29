import redis, { RedisClient } from 'redis';
import { BlockChain, TransactionPool, Transaction } from './index';

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
};

export class PubSub {
  public publisher: RedisClient;
  public subscriber: RedisClient;
  constructor(
    public blockchain: BlockChain,
    public transactionPool: TransactionPool
  ) {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribeToChannels();
    this.subscriber.on('message', (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message received. Channel: ${channel}. Message ${message}.`);
    const parsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockChainTransactions(parsedMessage);
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
    }
  }

  publish(channel: string, message: string) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  broadcastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain));
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction));
  }
}
