import { INITIAL_BALANCE } from '../config/config';
import { ec } from '../helpers';
import { calculateHash } from '../helpers/calculate-hash.helper';
import { Block, Transaction } from './index';

export class Wallet {
  constructor(
    public balance: number = INITIAL_BALANCE,
    public keyPair = ec.genKeyPair(),
    public publicKey: string = keyPair.getPublic().encode('hex', true)
  ) {}

  // Ký transaction
  sign(data) {
    return this.keyPair.sign(calculateHash(data));
  }

  // Tạo transaction
  createTransaction(
    recipient: string,
    amount: number,
    chain: Block[]
  ): Transaction {
    if (chain) {
      this.balance = Wallet.calculateBalance(chain, this.publicKey);
    }

    // Nếu lượng coin trong ví nhỏ hơn lượng muốn gửi
    if (this.balance < amount) {
      throw new Error('Amount exceeds balance');
    }
    return new Transaction(this, recipient, amount, null, null);
  }

  static calculateBalance(chain: Block[], address: string) {
    let outputsTotal = 0;
    let hasConductedTransaction = false;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];
      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }
        const addressOutput = transaction.outputMap[address];
        if (addressOutput) {
          outputsTotal += addressOutput;
        }
        if (hasConductedTransaction) {
          break;
        }
      }
    }
    return !hasConductedTransaction
      ? INITIAL_BALANCE + outputsTotal
      : outputsTotal;
  }
}
