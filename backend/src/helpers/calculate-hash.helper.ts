import sha256 from 'crypto-js/sha256';

export const calculateHash = (...inputs) => {
  return sha256(inputs.sort().join('')).toString();
};
