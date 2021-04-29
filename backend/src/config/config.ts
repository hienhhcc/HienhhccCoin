const INITIAL_DIFFICULTY = 3;
export const MINE_RATE = 1000;

export const INITIAL_BALANCE = 1000;

export const REWARD_INPUT = { address: '*authorized-reward*' };

export const MINING_REWARD = 50;

export const GENESIS_DATA = {
  timestamp: Date.now(),
  previousHash: '-----',
  hash: '7409d54d318cb3abe4ecd7d6eb0376403a29244ff1d8ea5028177b663a6840f0',
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};
