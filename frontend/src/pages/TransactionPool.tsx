import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import Transaction from '../components/Transaction';
import './TransactionPool.css';

const TransactionPool: React.FC = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});
  const { data, error } = useSWR('http://host.docker.internal:8001/transaction-pool-map');
  useEffect(() => {
    if (data) {
      setTransactionPoolMap(data.transactionPoolMap);
    }
  }, [data]);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <div className="TransactionPool">
      <div>
        <Link to="/">Home</Link>
        <h3>Transaction Pool</h3>
        {Object.values(transactionPoolMap).map((transaction: any) => {
          return (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionPool;
