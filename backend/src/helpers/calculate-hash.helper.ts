import sha256 from 'crypto-js/sha256';

export const calculateHash = (...inputs) => {
  return sha256(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join('')
  ).toString();
};
