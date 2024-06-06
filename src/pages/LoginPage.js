import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import auth object
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import GoogleAuthProvider

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is already authenticated, redirect to home page
        // navigate('/home');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Successful login
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage
      navigate('/home');
    } catch (error) {
      setError('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title>Login</Card.Title>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button variant="primary" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
