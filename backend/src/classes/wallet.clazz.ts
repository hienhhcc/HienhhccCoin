import { INITIAL_BALANCE } from '../config/config';
import { ec } from '../helpers';
import { calculateHash } from '../helpers/calculate-hash.helper';
import Transaction from './transaction.clazz';

class Wallet {
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
  createTransaction(recipient: string, amount: number): Transaction {
    // Nếu lượng coin trong ví nhỏ hơn lượng muốn gửi
    if (this.balance < amount) {
      throw new Error('Amount exceeds balance');
    }
    return new Transaction(this, recipient, amount);
  }
}

export default Wallet;
