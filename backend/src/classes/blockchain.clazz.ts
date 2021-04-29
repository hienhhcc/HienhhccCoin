import { MINING_REWARD, REWARD_INPUT } from 'src/config/config';
import { calculateHash } from '../helpers/calculate-hash.helper';
import { Block, Transaction, Wallet } from './index';

export class BlockChain {
  constructor(public chain = [Block.getGenesisBlock()]) {}

  addBlock(data: any) {
    const newBlock = Block.mineBlock(this.chain[this.chain.length - 1], data);

    this.chain.push(newBlock);
  }

  validateTransactionData(chain: Block[]) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;
      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount++;
          if (rewardTransactionCount > 1) {
            console.error('Miner rewards exceed limit');
            return false;
          }
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward is invalid');
            return false;
          }
        } else {
          if (!Transaction.validateTransaction(transaction)) {
            console.error('Invalid transaction');
            return false;
          }

          const trueBalance = Wallet.calculateBalance(
            this.chain,
            transaction.input.address
          );

          if (transaction.input.amount !== trueBalance) {
            console.error('Invalid input amount');
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              'An identical transaction appears more than once in a block'
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
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

  replaceChain(chain: Block[], validateTransactions, onSuccess) {
    if (
      BlockChain.isValidChain(chain) &&
      chain.length > this.chain.length &&
      validateTransactions &&
      !this.validateTransactionData(chain)
    ) {
      if (onSuccess) onSuccess();
      this.chain = chain;
    }
  }
}
