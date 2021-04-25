import sha256 from 'crypto-js/sha256';

const calculateHash = (timestamp, previousHash, data) => {
  return sha256(timestamp + previousHash + data).toString();
};

export default calculateHash;
