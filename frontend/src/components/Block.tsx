import { useState } from 'react';
import './Block.css';
import { IBlock } from './Block.interface';
import { Button } from 'antd';
import Transaction from './Transaction';

interface Props {
  block: IBlock;
}

const Block: React.FC<Props> = ({ block }) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);
  const { timestamp, hash } = block;
  const hashDisplay = `${hash.substring(0, 15)}...`;

  const toggleTransaction = () => {
    setDisplayTransaction(!displayTransaction);
  };

  const makeDisplayTransaction = () => {
    const { data } = block;

    const stringifiedData = JSON.stringify(data);

    const dataDisplay =
      stringifiedData.length > 35
        ? `${stringifiedData.substring(0, 35)}...`
        : stringifiedData;

    return (
      <div>
        {displayTransaction ? (
          <>
            {data.map((transaction: any) => (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            ))}
            <br />
            <Button onClick={toggleTransaction}>Show Less</Button>
          </>
        ) : (
          <>
            <div>Data: {dataDisplay}</div>
            <br />
            <Button onClick={toggleTransaction}>Show more</Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="Block">
      <div>Hash: {hashDisplay}</div>
      <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
      {makeDisplayTransaction()}
    </div>
  );
};

export default Block;
