// src/components/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white" style={{ height: '100vh', width: '200px', position: 'fixed' }}>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/home" className="text-white">Home</Nav.Link>
        <Nav.Link href="/link" className="text-white">Link</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
