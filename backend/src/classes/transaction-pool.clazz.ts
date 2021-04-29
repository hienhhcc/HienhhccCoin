import { Transaction } from './index';

export class TransactionPool {
  constructor(public transactionMap = {}) {}

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
}
