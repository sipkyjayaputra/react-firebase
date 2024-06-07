import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { auth, db } from "./firebaseConfig"; // Import auth object
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import onAuthStateChanged
import { Modal, Button } from "react-bootstrap"; // Import React Bootstrap components
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import User from "./pages/User";
import NotFound from "./pages/NotFound";

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [countdown, setCountdown] = useState(60); // 1 second countdown
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAuthenticatedUser(userData);
          if (userData.status === -1) {
            setShowInactiveModal(true);
            automaticallyLogout();
          } else {
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
          navigate("/login");
        }
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    });

    // Clean up subscription
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setIsLoggedIn(false);
      setShowInactiveModal(false);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const automaticallyLogout = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(countdownInterval);
          handleLogout();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, countdown);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home authenticatedUser={authenticatedUser} />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}
        />
        <Route path="/home" element={<Home authenticatedUser={authenticatedUser} />} />
        <Route path="/user" element={<User authenticatedUser={authenticatedUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Modal
        show={showInactiveModal}
        onHide={() => setShowInactiveModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Inactive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account is not active. Please contact support or try logging in
          with a different account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
