import React from 'react';
import { Layout, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
import bitcoinLogo from '../../assets/images/bitcoin.jpg';
import 'antd/dist/antd.css';
import './MainHeader.css';

const { Header } = Layout;

// interface Props {
//   /** The user's name */
//   name: string;
//   /** Should the name be rendered in bold */
//   priority?: boolean;
// }

const MainHeader: React.FC = () => {
  return (
    <Header>
      <Link to="/" className="container-logo">
        <div className="logo">
          <Avatar src={bitcoinLogo} size="default" />
          <span style={{ marginLeft: '8px' }}>HienhhccCoin</span>
        </div>
      </Link>
      <NavigationItems isAuthenticated={false} />
    </Header>
  );
};

export default MainHeader;
