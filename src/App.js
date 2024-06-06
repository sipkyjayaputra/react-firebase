import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LinkPage from './pages/LinkPage';
import LoginPage from './pages/LoginPage';
import { auth } from './firebaseConfig'; // Import auth object
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Layout>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/link" element={<LinkPage />} />
                </Routes>
              </Layout>
            ) : (
              <LoginPage />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
