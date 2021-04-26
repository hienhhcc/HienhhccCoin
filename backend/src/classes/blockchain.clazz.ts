import calculateHash from '../helpers/calculate-hash.helper';
import Block from './block.clazz';

class BlockChain {
  constructor(public chain = [Block.getGenesisBlock()]) {}

  addBlock(data: any) {
    const newBlock = Block.mineBlock(this.chain[this.chain.length - 1], data);

    this.chain.push(newBlock);
  }

  static isValidChain(chain: Block[]): boolean {
    // Nếu block đầu của chain ko giống với genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesisBlock())) {
      return false;
    }

    // Duyệt qua tất cả các block của chain
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, previousHash, hash, data, difficulty, nonce } = chain[
        i
      ];
      const previousBlock = chain[i - 1];
      const previousDifficulty = previousBlock.difficulty;
      // Nếu hash của previousBlock không giống previousHash của block sau
      if (previousBlock.hash !== previousHash) {
        return false;
      }
      // Tính toán lại hash của block
      if (
        calculateHash(timestamp, previousHash, data, difficulty, nonce) !== hash
      ) {
        return false;
      }

      if (previousDifficulty - difficulty > 1) {
        return false;
      }
    }
    return true;
  }

  replaceChain(chain: Block[]) {
    if (BlockChain.isValidChain(chain) && chain.length > this.chain.length) {
      this.chain = chain;
    }
  }
}

export default BlockChain;
