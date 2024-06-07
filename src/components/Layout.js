import React from 'react';
import AppNavbar from './AppNavbar';
import Sidebar from './Sidebar';

const Layout = ({ children, authenticatedUser }) => {
  return (
    <div>
      <AppNavbar authenticatedUser={authenticatedUser} />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
