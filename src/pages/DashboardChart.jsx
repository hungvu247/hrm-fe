import React from "react";
import DepartmentBudgetChart from "./DepartmentBudgetChart";
import DepartmentChart from "./DepartmentChart";

const Dashboard = () => {
  return (
    <div style={{ width: "90%", margin: "0 auto", paddingTop: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Bảng điều khiển thống kê</h1>

      {/* Department Budget Chart */}
      <DepartmentBudgetChart />

      {/* Department Chart */}
      <DepartmentChart />
    </div>
  );
};

export default Dashboard;
