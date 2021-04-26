import ecc from 'elliptic';
import { calculateHash } from './calculate-hash.helper';

const EC = ecc.ec;
export const ec = new EC('secp256k1');

export const verifySignature = (publicKey, data, signature) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

  return keyFromPublic.verify(calculateHash(data), signature);
};
