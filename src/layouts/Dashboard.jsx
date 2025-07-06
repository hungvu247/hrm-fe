import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import Navi from "./Navi";
import Footer from "./Footer";
import HomeLayout from "./HomeLayout";

// Department Pages
import DepartmentAdd from "../pages/DepartmentAdd";
import DepartmentDetail from "../pages/DepartmentDetail";
import DepartmentUpdate from "../pages/DepartmentUpdate";
import DepartmentList from "../pages/DepartmentList";
import DepartmentLayout from "./DepartmentLayout";

// Positions Pages
import PositionLayout from "./PosistionLayout";
import PositionAdd from "../pages/PositionAdd";
import PositionUpdate from "../pages/PositionUpdate";
export default function Dashboard() {
  return (
    <Container className="dashboard">
      <Navi />
      <Routes>
        <Route path="" element={<HomeLayout />} />
        <Route path="department" element={<DepartmentLayout />} />
        <Route path="department/add" element={<DepartmentAdd />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="department/edit/:id" element={<DepartmentUpdate />} />
        <Route
          path="department/detail/:id"
          element={<DepartmentDetail />}
        />{" "}
        <Route path="positions" element={<PositionLayout />}></Route>
        <Route path="position/add" element={<PositionAdd />} />
        <Route path="position/edit/:id" element={<PositionUpdate />}></Route>
      </Routes>

      <Footer />
    </Container>
  );
}
