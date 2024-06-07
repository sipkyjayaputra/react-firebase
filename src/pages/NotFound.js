import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css'; // Import custom CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-heading">404 - Not Found</h1>
        <p className="not-found-text">The page you're looking for does not exist.</p>
        <Link to="/home" className="not-found-link">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
