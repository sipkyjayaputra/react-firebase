import React from "react";
import Layout from "../components/Layout";

const Home = ({ authenticatedUser }) => {
  return (
    <div
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }} 
    >
      <Layout authenticatedUser={authenticatedUser}>
        <h2>Welcome, {authenticatedUser?.name}!</h2>
      </Layout>
    </div>
  );
};

export default Home;
