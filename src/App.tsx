import React from 'react';
import './App.css';
import './index.css';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Routes } from './components/Routes';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import {
  getName,
  OpenNotification,
  setImageURL,
  setName,
  setToken,
} from './services/helpers';

const { Header, Content, Footer } = Layout;
export const App = () => {
  const { REACT_APP_GOOGLE_OAUTH_CLIENT_ID } = process.env;
  const clientId = REACT_APP_GOOGLE_OAUTH_CLIENT_ID
    ? REACT_APP_GOOGLE_OAUTH_CLIENT_ID
    : 'no-id';
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const onLoginSuccess = (response: any) => {
    setToken(response.tokenId);
    setName(response.profileObj.givenName);
    setImageURL(response.profileObj.imageURL);
    setIsAuthenticated(true);
  };

  const onLogoutSuccess = () => {
    setIsAuthenticated(false);
    setToken('');
  };
  const onLoginFailure = () => {
    setIsAuthenticated(false);
    OpenNotification({
      type: 'error',
      message: 'Could not login',
      description: 'Something went wrong',
    });
  };
  return (
    <div className="app">
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo-genotype">
            <Link to="/">Genotype</Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            selectedKeys={[useLocation().pathname]}
          >
            <Menu.Item key="/">
              <Link to="/">
                <span>Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/samples" disabled={!isAuthenticated}>
              <Link to="/samples">
                <span>Samples</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/missing" disabled={!isAuthenticated}>
              <Link to="/missing">
                <span>Missing</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/plates" disabled={!isAuthenticated}>
              <Link to="/plates">
                <span>Plates</span>
              </Link>
            </Menu.Item>
          </Menu>
          <div>
            {isAuthenticated && <div className="greeting">Hi {getName()}!</div>}
          </div>
          <div className="google-button">
            {isAuthenticated && (
              <GoogleLogout
                render={(renderProps) => (
                  <Button type="primary" onClick={renderProps.onClick}>
                    Logout
                  </Button>
                )}
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
              />
            )}
            {!isAuthenticated && (
              <GoogleLogin
                render={(renderProps) => (
                  <Button type="primary" onClick={renderProps.onClick}>
                    Login with Google
                  </Button>
                )}
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
              />
            )}
          </div>
        </Header>
        <Content
          className="site-layout"
          style={{ padding: '0 50px', marginTop: 64 }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380 }}
          >
            <Routes />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Clinical Genomics ©2020</Footer>
      </Layout>
    </div>
  );
};

export default App;
