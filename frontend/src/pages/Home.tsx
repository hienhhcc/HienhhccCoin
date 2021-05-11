import {
  MoneyCollectTwoTone,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Statistic } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import useSWR from 'swr';
import './Home.css';

const Home: React.FC = () => {
  console.log(process.env.BACKEND_URL);
  console.log(process.env.REACT_APP_BACKEND_URL);
  const { data, error } = useSWR(
    `http://host.docker.internal:8001/wallet-info`
  );

  console.log(data);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div
      style={{
        width: '80%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '12px',
      }}
    >
      <div
        style={{
          width: '30%',
          height: '161px',
          display: 'flex',
          backgroundColor: '#7070e3',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
        }}
        className="create-new-wallet"
      >
        <div
          style={{
            width: '30%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ backgroundColor: 'orange' }}
          />
        </div>
        <div
          style={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '30px' }}>Address</div>
          <div
            style={{ color: '#fff', fontWeight: 300, wordBreak: 'break-all' }}
          >
            {data.address}
          </div>
        </div>
      </div>
      <div
        style={{
          width: '30%',
          height: '161px',
          display: 'flex',
          backgroundColor: '#5a78f0',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
        }}
        className="access-my-wallet"
      >
        <div
          style={{
            width: '30%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <WalletOutlined style={{ fontSize: '64px' }} />
        </div>
        <div
          style={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '30px' }}>Balance</div>
          <p>
            <Statistic
              title="HHCC"
              value={data.balance}
              prefix={<MoneyCollectTwoTone />}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
