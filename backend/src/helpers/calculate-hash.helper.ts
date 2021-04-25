import sha256 from 'crypto-js/sha256';

const calculateHash = (timestamp, previousHash, data, difficulty, nonce) => {
  return sha256(
    timestamp + previousHash + data + difficulty + nonce
  ).toString();
};

export default calculateHash;
