import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import auth object
import { signOut } from 'firebase/auth'; // Import signOut
import Avatar from 'react-avatar';
import '../css/AppNavbar.css'; // Import custom CSS file for styling

const AppNavbar = ({authenticatedUser}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Retrieve user data from local storage
        if (authenticatedUser && authenticatedUser.name) {
            setUsername(authenticatedUser.name);
        }
    }, [authenticatedUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user
            localStorage.removeItem('user'); // Remove user data from local storage
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Navbar className="app-navbar" variant="dark" expand="lg">
            <Navbar.Brand href="/home" className="app-brand">App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav className="ml-auto">
                    <Dropdown alignRight drop="start">
                        <Dropdown.Toggle variant="007bff" id="dropdown-basic">
                            <Avatar name={username} size="30" round={true}>{username}</Avatar>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                            {username && <span className=""><Dropdown.Item className="dropdown-item">Welcome, {username}!</Dropdown.Item></span>}
                            <Dropdown.Item className="dropdown-item" onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
