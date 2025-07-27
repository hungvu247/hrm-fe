import React from "react";
import { NavLink } from "react-router-dom";
import LogIn from "./LogIn";
import { Menu, Container, Header } from "semantic-ui-react";

export default function Navi() {
  return (
    <Menu borderless fixed="top">
      <Container>
        <Menu.Item color="violet" position="left">
          <Header
            as="h4"
            color="violet"
            className="orbitron"
            icon="cube"
            content="HRMS"
          />
        </Menu.Item>
        <Menu.Item
          as={NavLink}
          to="/dashboard/home"
          icon="circle notched"
          content="Home"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/departments"
          icon="list alternate outline"
          content="Department"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/positions"
          icon="user outline"
          content="Positions"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/employees"
          icon="building outline"
          content="Employees"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/chart"
          icon="chart bar"
          content="Statictis"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/projects"
          icon="user project"
          content="Projects"
        />
        <Menu.Item
          as={NavLink}
          to="/dashboard/request"
          icon="mail"
          content="Application "
        />
        <Menu.Menu position="right">
          <Menu.Item position="right">
            <LogIn />
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
