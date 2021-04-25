import calculateHash from '../helpers/calculate-hash.helper';
import { GENESIS_DATA } from '../config/config';

class Block {
  constructor(
    private timestamp: number,
    private previousHash: string,
    private hash: string,
    private data: any
  ) {}

  static getGenesisBlock() {
    return new this(
      GENESIS_DATA.timestamp,
      GENESIS_DATA.previousHash,
      GENESIS_DATA.hash,
      GENESIS_DATA.data
    );
  }

  static mineBlock(previousBlock: Block, data: any) {
    const timestamp = Date.now();
    const previousHash = previousBlock.hash;
    console.log(calculateHash(timestamp, previousHash, data));

    return new this(
      timestamp,
      previousHash,
      calculateHash(timestamp, previousHash, data),
      data
    );
  }
}

export default Block;
