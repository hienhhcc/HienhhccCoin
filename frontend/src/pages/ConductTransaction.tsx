import './ConductTransaction.css';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const ConductTransaction: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const history = useHistory();

  const updateRecipient = (event: any) => {
    setRecipient(event.target.value);
  };

  const updateAmount = (event: any) => {
    setAmount(+event.target.value);
  };

  const conductTransaction = () => {
    fetch('http://localhost:8001/transact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  };

  return (
    <div className="ConductTransaction">
      <Link to="/">Home</Link>
      <h3>Conduct a Transaction</h3>
      <FormGroup>
        <FormControl
          inputMode="text"
          placeholder="recipient"
          value={recipient}
          onChange={updateRecipient}
        />
      </FormGroup>
      <FormGroup>
        <FormControl
          inputMode="text"
          placeholder="amount"
          value={amount}
          onChange={updateAmount}
        />
      </FormGroup>
      <div>
        <Button onClick={conductTransaction}>Submit</Button>
      </div>
    </div>
  );
};

export default ConductTransaction;
