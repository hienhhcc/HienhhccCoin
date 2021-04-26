import { INITIAL_BALANCE } from '../config/config';
import { ec } from '../helpers';
import { calculateHash } from '../helpers/calculate-hash.helper';

class Wallet {
  constructor(
    public balance: number = INITIAL_BALANCE,
    public keyPair = ec.genKeyPair(),
    public publicKey: string = keyPair.getPublic().encode('hex', true)
  ) {}

  sign(data) {
    return this.keyPair.sign(calculateHash(data));
  }
}

export default Wallet;
