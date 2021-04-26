import { verifySignature } from '../helpers';
import uuid from 'uuid/v1';
import Wallet from './wallet.clazz';

class Transaction {
  public id: string;
  public outputMap;
  public input;
  constructor(public senderWallet, public recipient, public amount) {
    this.id = uuid();
    this.outputMap = this.createOutputMap(senderWallet, recipient, amount);
    this.input = this.createInput(senderWallet, this.outputMap);
  }

  createOutputMap(senderWallet: Wallet, recipient: string, amount: number) {
    const outputMap = {};
    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }

  createInput(senderWallet: Wallet, outputMap: any) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    };
  }

  static validateTransaction(transaction: Transaction): boolean {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total: number, outputAmount: number) => total + outputAmount,
      0
    );
    // Nếu lượng coin ban đầu ko bằng lượng gửi đi + lượng còn lại
    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    // Nếu signature không đúng
    if (!verifySignature(address, outputMap, signature)) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }
    return true;
  }

  update(senderWallet: Wallet, recipient: string, amount: number) {
    // Nếu balance trong ví ít hơn lượng gửi đi
    if (this.outputMap[senderWallet.publicKey] < amount) {
      throw new Error('Amount exceeds balance');
    }

    if (!this.outputMap[recipient]) {
      // Nếu gửi người khác
      this.outputMap[recipient] = amount;
    } else {
      // Nếu gửi người như trước đó
      this.outputMap[recipient] += amount;
    }

    this.outputMap[recipient] = amount;
    this.outputMap[senderWallet.publicKey] -= amount;
    this.input = this.createInput(senderWallet, this.outputMap);
  }
}

export default Transaction;
