import React, { Suspense } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Layout, { Content } from 'antd/lib/layout/layout';
import MainHeader from './components/MainHeader/MainHeader';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Home from './pages/Home';
import CreateNewWallet from './pages/CreateNewWallet';
import AccessMyWallet from './pages/AccessMyWallet';

function App() {
  let routes = (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/create-new-wallet" exact>
        <CreateNewWallet />
      </Route>
      <Route path="/access-my-wallet" exact>
        <AccessMyWallet />
      </Route>
      {/* <Redirect to="/" /> */}
    </Switch>
  );
  return (
    <Layout>
      <MainHeader />
      <Suspense fallback={<LoadingOutlined style={{ fontSize: 100 }} spin />}>
        <Content style={{ backgroundColor: 'white', display: 'contents' }}>
          {routes}
        </Content>
      </Suspense>
    </Layout>
  );
}

export default App;
