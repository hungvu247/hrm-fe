import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden403 = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
    padding: "20px",
  };

  const codeStyle = {
    fontSize: "120px",
    fontWeight: "bold",
    color: "#42b983",
    textShadow: "2px 2px 0 #1e3c29",
    margin: 0,
  };

  const titleStyle = {
    fontSize: "32px",
    color: "#3c225a",
    marginTop: "10px",
    marginBottom: "5px",
  };

  const descriptionStyle = {
    fontSize: "18px",
    color: "#555",
    marginBottom: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#3c225a",
    color: "white",
    padding: "12px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "#291741";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "#3c225a";
  };

  return (
    <div style={containerStyle}>
      <h1 style={codeStyle}>403</h1>
      <h2 style={titleStyle}>Access denied...</h2>
      <p style={descriptionStyle}>
        You don't have permission to access this page.
      </p>
      <button
        style={buttonStyle}
        onClick={() => navigate("/dashboard/home")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Go to homepage
      </button>
    </div>
  );
};

export default Forbidden403;
