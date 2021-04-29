import { Transaction } from './index';

export class TransactionPool {
  constructor(public transactionMap = {}) {}

  clear() {
    this.transactionMap = {};
  }

  setTransaction(transaction: Transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  existingTransaction(inputAddress: string) {
    const transactions: Transaction[] = Object.values(this.transactionMap);

    return transactions.find(
      (transaction) => transaction.input.address === inputAddress
    );
  }

  validTransactions() {
    return Object.values(
      this.transactionMap
    ).filter((transaction: Transaction) =>
      Transaction.validateTransaction(transaction)
    );
  }

  clearBlockChainTransactions(chain) {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];
      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }
}
