import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import Navi from "./Navi";
import Footer from "./Footer";
import HomeLayout from "./HomeLayout";

// Department Pages (converted from Candidate)
import DepartmentAdd from "./../pages/DepartmentAdd";
import DepartmentDetail from "./../pages/DepartmentDetail";
import DepartmentUpdate from "./../pages/DepartmentUpdate";
import DepartmentList from "../pages/DepartmentList";
import DepartmentLayout from "./DepartmentLayout"; // thêm ở đầu

export default function Dashboard() {
  return (
    <Container className="dashboard">
      <Navi />

      {/* Home */}
      <Route exact path="/" component={HomeLayout} />
      <Route exact path="/home" component={HomeLayout} />

      {/* Department */}
      <Route exact path="/department" component={DepartmentLayout} />
      <Route exact path="/department/add" component={DepartmentAdd} />
      <Route exact path="/departments" component={DepartmentList} />
      <Route exact path="/departments/:id" component={DepartmentDetail} />
      <Route
        exact
        path="/departments/:id/update"
        component={DepartmentUpdate}
      />

      <Footer />
    </Container>
  );
}
