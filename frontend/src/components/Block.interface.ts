export interface IBlock {
  timestamp: number;
  previousHash: string;
  hash: string;
  data: any;
  difficulty: number;
  nonce: number;
}
