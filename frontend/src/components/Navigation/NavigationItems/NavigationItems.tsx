import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './NavigationItems.css';

interface Props {
  /** The user's name */
  isAuthenticated: boolean;
}

const NavigationItems: React.FC<Props> = ({ isAuthenticated }) => {
  let content = (
    <>
      <Link to="/conduct-transaction">
        <Button
          type="primary"
          style={{
            marginRight: '4px',
          }}
        >
          Conduct transaction
        </Button>
      </Link>
      <Link to="/list-transaction">
        <Button type="primary" ghost>
          View transactions
        </Button>
      </Link>
    </>
  );

  if (isAuthenticated) {
    // content = (
    //   <>
    //     <Button
    //       className="user-profile"
    //       size="large"
    //       shape="round"
    //       type="primary"
    //       style={{
    //         marginRight: '4px',
    //         padding: '4px 19px 4px  4px',
    //         display: 'flex',
    //         alignItems: 'center',
    //       }}
    //     >
    //       {getUserImageUrlFromStorage() ? (
    //         <Avatar src={getUserImageUrlFromStorage()} />
    //       ) : (
    //         <Avatar
    //           style={{
    //             color: '#f56a00',
    //             backgroundColor: '#fde3cf',
    //             height: '30px',
    //             marginRight: '4px',
    //           }}
    //         >
    //           {getUsernameFromStorage().split(' ')[0][0]}
    //         </Avatar>
    //       )}
    //       {getUsernameFromStorage()}
    //     </Button>
    //     <Dropdown overlay={menu} placement="bottomRight" arrow>
    //       <Button
    //         size="large"
    //         shape="circle"
    //         type="gray"
    //         style={{
    //           marginRight: '4px',
    //           paddingTop: '0px',
    //         }}
    //       >
    //         <CaretDownOutlined />
    //       </Button>
    //     </Dropdown>
    //   </>
    // );
  }
  return <div className="navigation-items">{content}</div>;
};

export default NavigationItems;
