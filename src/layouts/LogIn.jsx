import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Image, Dropdown } from "semantic-ui-react";

export default function LogIn() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("user");

  const handleAvatarClick = () => {
    navigate("/user-detail");
  };

  if (token) {
    return (
      <Dropdown
        trigger={
          <span>
            <Image
              avatar
              src="/path/to/avatar.jpg"
              onClick={handleAvatarClick}
            />
            <span style={{ marginLeft: "8px", color: "black" }}>
              {userName}
            </span>
          </span>
        }
      />
    );
  }

  return (
    <Button circular color="pink" content="Log-in" as={NavLink} to="/login" />
  );
}
