import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import auth object
import { signOut } from 'firebase/auth'; // Import signOut

const AppNavbar = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        // Retrieve user data from local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.displayName) {
            setUsername(userData.displayName);
            setAvatar(userData.displayName.charAt(0).toUpperCase());
        }
    }, []);

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
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="#home">React App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav className="ml-auto">
                    {/* Display avatar based on the first letter of the username */}
                    {avatar ? (
                        <span className="navbar-avatar me-3">{avatar}</span>
                    ) : (
                        <FaUserCircle size={30} className="me-3" >S</FaUserCircle>
                    )}
                    {/* Display welcome message with the username */}
                    {username && <span className="navbar-text me-3">Welcome, {username}!</span>}
                    <Dropdown alignRight>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            <FaUserCircle size={30} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
