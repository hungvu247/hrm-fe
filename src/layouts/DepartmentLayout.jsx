// src/pages/DepartmentLayout.jsx
import React from "react";
import Headline from "../layouts/Headline";
import DepartmentList from "../pages/DepartmentList"; // đường dẫn đúng

export default function DepartmentLayout() {
  return (
    <div>
      <Headline content="Department List" />
      <DepartmentList />
    </div>
  );
}
