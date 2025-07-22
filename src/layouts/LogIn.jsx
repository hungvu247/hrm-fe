import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Image, Dropdown } from "semantic-ui-react";

export default function LogIn() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("user");
  const employeeId = localStorage.getItem("employeeId");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAvatarClick = () => {
    navigate("employee/" + employeeId);
  };

  if (token) {
    return (
      <Dropdown
        trigger={
          <span style={{ cursor: "pointer" }}>
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
        pointing="top right"
        icon={null}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="Thông tin cá nhân" onClick={handleAvatarClick} />

          <Dropdown.Item
            as={NavLink}
            to="/dashboard/promotion/request"
            text="Yêu cầu thăng chức"
          />
          <Dropdown.Item text="Đăng xuất" onClick={handleLogout} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Button circular color="pink" content="Log-in" as={NavLink} to="/login" />
  );
}
