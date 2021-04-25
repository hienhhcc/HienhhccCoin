import calculateHash from '../helpers/calculate-hash.helper';
import { GENESIS_DATA, MINE_RATE } from '../config/config';
import hexToBinary from 'hex-to-binary';

class Block {
  constructor(
    public timestamp: number,
    public previousHash: string,
    public hash: string,
    public data: any,
    public difficulty: number,
    public nonce: number
  ) {}

  static getGenesisBlock(): Block {
    return new this(
      GENESIS_DATA.timestamp,
      GENESIS_DATA.previousHash,
      GENESIS_DATA.hash,
      GENESIS_DATA.data,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.nonce
    );
  }

  static mineBlock(previousBlock: Block, data: any): Block {
    let { difficulty, hash: previousHash } = previousBlock;
    let nonce = 0;
    while (true) {
      const timestamp = Date.now();
      difficulty = this.adjustDifficulty(previousBlock, timestamp);
      const hash: string = calculateHash(
        timestamp,
        previousHash,
        data,
        difficulty,
        nonce
      );
      // Nếu tìm ra đc hash khớp "difficulty" 0 ở đầu
      if (hexToBinary(hash).substring(0, difficulty) === '0'.repeat(difficulty))
        return new this(
          timestamp,
          previousHash,
          calculateHash(timestamp, previousHash, data, difficulty, nonce),
          data,
          difficulty,
          nonce
        );
    }
  }

  static adjustDifficulty(originalBlock: Block, timestamp: number): number {
    const { difficulty, timestamp: originTimestamp } = originalBlock;
    if (difficulty < 1) {
      return 1;
    }
    if (timestamp - originTimestamp > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

export default Block;
