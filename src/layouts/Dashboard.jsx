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
import EmployeeList from "../pages/employee/EmployeeList";
import EmployeeAdd from "../pages/employee/EmployeeAdd";
import EmployeeEdit from "../pages/employee/EmployeeEdit";
import EmployeeContactList from "../pages/employeeContact/EmployeeContactList";
import EmployeeContactAdd from "../pages/employeeContact/EmployeeContactAdd";
import EmployeeContactEdit from "../pages/employeeContact/EmployeeContactEdit";
import EmployeeProjectList from "../pages/employeeProject/EmployeeProjectList";
import EmployeeProjectAdd from "../pages/employeeProject/EmployeeProjectAdd";

export default function Dashboard() {
  return (
    <Container className="dashboard">
      <Navi />
        <Routes>
            <Route path="" element={<HomeLayout/>}/>
            <Route path="department" element={<DepartmentLayout/>}/>
            <Route path="department/add" element={<DepartmentAdd/>}/>
            <Route path="departments" element={<DepartmentList/>}/>
            <Route path="departments/:id" element={<DepartmentDetail/>}/>
            <Route path="department/edit/:id" element={<DepartmentUpdate/>}/>

            <Route path="employees" element={<EmployeeList/>}/>
            <Route path="employees/add" element={<EmployeeAdd/>}/>
            <Route path="employees/edit/:id" element={<EmployeeEdit/>}/>

            <Route path="employee-contacts" element={<EmployeeContactList/>}/>
            <Route path="employee-contacts/add" element={<EmployeeContactAdd/>}/>
            <Route path="employee-contacts/edit/:id" element={<EmployeeContactEdit/>}/>

            <Route path="employee-projects/:id" element={<EmployeeProjectList/>}/>
            <Route path="employee-projects/add/:projectId" element={<EmployeeProjectAdd/>}/>
            <Route path="/dashboard/employee-projects/edit/:employeeId/:projectId" element={<EmployeeProjectAdd />} />
        </Routes>

      <Footer />
    </Container>
  );
}
