import React from 'react';
import { Nav } from 'react-bootstrap';
import '../css/Sidebar.css'; // Import custom CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/home" className="sidebar-link">Home</Nav.Link>
        <Nav.Link href="/user" className="sidebar-link">User</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
