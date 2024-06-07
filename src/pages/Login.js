import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { db, auth } from "../firebaseConfig"; // Import auth and db objects
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import GoogleAuthProvider
import { setDoc, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Import FaGoogle icon

const Login = ({ setIsLoggedIn, isLoggedIn }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Successful login
      const user = result.user;

      // Check if the user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Add the new user data to Firestore if it doesn't exist
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
          role: 3,
          status: -1,
        });
      }

      setIsLoggedIn(true);
    } catch (error) {
      setError("Error signing in with Google: " + error.message);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h2  style={{ color: "#007bff", marginBottom: "35px" }}>Welcome to React Firebase</h2>
      <Card
        style={{
          width: "25rem",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: "#007bff" }}>Login</Card.Title>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="d-flex flex-column align-items-center mt-4">
            <Button
              variant="danger"
              onClick={handleGoogleLogin}
              style={{ width: "100%" }}
            >
              <FaGoogle style={{ marginRight: "5px" }} />
              Sign in with Google
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
