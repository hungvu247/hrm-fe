import React from "react";
import { Route, Routes } from "react-router-dom";
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
import DepartmentChart from "../pages/DepartmentChart";
import EmployeeList from "../pages/employee/EmployeeList";
import EmployeeAdd from "../pages/employee/EmployeeAdd";
import EmployeeEdit from "../pages/employee/EmployeeEdit";
import EmployeeContactList from "../pages/employeeContact/EmployeeContactList";
import EmployeeContactAdd from "../pages/employeeContact/EmployeeContactAdd";
import EmployeeContactEdit from "../pages/employeeContact/EmployeeContactEdit";
import EmployeeProjectList from "../pages/employeeProject/EmployeeProjectList";
import EmployeeProjectAdd from "../pages/employeeProject/EmployeeProjectAdd";

// Positions Pages
import PositionLayout from "./PosistionLayout";
import PositionAdd from "../pages/PositionAdd";
import PositionUpdate from "../pages/PositionUpdate";

//Employee Info Page
import EmployeeInfo from "../pages/EmployeeInfo";
import EmployeeProjectEdit from "../pages/employeeProject/EmployeeProjectEdit";
import PromotionRequestForm from "../pages/PromotionRequestForm";
import ProjectList from "../pages/Project/ProjectList";
import ProjectEdit from "../pages/Project/ProjectEdit";
import ProjectAdd from "../pages/Project/ProjectAdd";
import ProjectDetail from "../pages/Project/ProjectDetail";
import DocumentAdd from "../pages/Document/DocumentAdd";
import DocumentEdit from "../pages/Document/DocumentEdit";

import DashboardChart from "../pages/DashboardChart";
import Forbidden403 from "../pages/403";
import PerformanceStatsByProject from "../pages/PerformanceStatsByProject";

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
        <Route path="department/chart" element={<DepartmentChart />}></Route>
        <Route path="positions" element={<PositionLayout />}></Route>
        <Route path="position/add" element={<PositionAdd />} />
        <Route path="position/edit/:id" element={<PositionUpdate />}></Route>
        <Route path="home" element={<HomeLayout />} />
        <Route path="employee/:id" element={<EmployeeInfo />}></Route>
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/add" element={<EmployeeAdd />} />
        <Route path="employees/edit/:id" element={<EmployeeEdit />} />
        <Route path="employee-contacts" element={<EmployeeContactList />} />
        <Route path="employee-contacts/add" element={<EmployeeContactAdd />} />
        <Route
          path="employee-contacts/edit/:id"
          element={<EmployeeContactEdit />}
        />
        <Route path="employee-projects/:id" element={<EmployeeProjectList />} />
        <Route
          path="employee-projects/add/:projectId"
          element={<EmployeeProjectAdd />}
        />
        <Route
          path="employee-projects/edit/:employeeId/:projectId"
          element={<EmployeeProjectEdit />}
        />
        <Route path="promotion/request" element={<PromotionRequestForm />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/edit/:id" element={<ProjectEdit />} />
        <Route path="projects/add" element={<ProjectAdd />} />
        <Route path="projects/detail/:projectId" element={<ProjectDetail />} />
        <Route path="document/add" element={<DocumentAdd />} />
        <Route path="document/edit/:id" element={<DocumentEdit />} />
        <Route path="forbidden" element={<Forbidden403 />} />

        <Route path="chart" element={<DashboardChart />}></Route>
        <Route
          path="/dashboard/project-statistics/:projectId"
          element={<PerformanceStatsByProject />}
        />
      </Routes>

      <Footer />
    </Container>
  );
}
